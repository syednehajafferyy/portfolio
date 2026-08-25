import fs from 'fs';
import path from 'path';
import os from 'os';

const DB_DIR = path.join(process.cwd(), 'database');
const TMP_DB_DIR = path.join(os.tmpdir(), 'database');

const GITHUB_OWNER = process.env.GITHUB_OWNER || process.env.NEXT_PUBLIC_GITHUB_OWNER || 'syednehajafferyy';
const GITHUB_REPO = process.env.GITHUB_REPO || process.env.NEXT_PUBLIC_GITHUB_REPO || 'portfolio';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';

const getRelativePath = (fileName) => {
  if (fileName.toLowerCase() === 'metadata') {
    return 'database/config/metadata.json';
  }
  return `database/${fileName}.json`;
};

const getFilePath = (fileName) => {
  const relPath = getRelativePath(fileName);
  return {
    primary: path.join(process.cwd(), relPath),
    tmp: path.join(os.tmpdir(), relPath),
    relPath
  };
};

// Sync updated JSON file directly to GitHub Repository
async function syncToGitHub(relPath, data, githubToken) {
  const token = githubToken || process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (!token) return false;

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${relPath}`;
  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64');

  try {
    let existingSha = null;
    const getRes = await fetch(`${url}?ref=${GITHUB_BRANCH}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Portfolio-Admin'
      },
      cache: 'no-store'
    });

    if (getRes.ok) {
      const getJson = await getRes.json();
      existingSha = getJson.sha;
    }

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Admin'
      },
      body: JSON.stringify({
        message: `Admin Panel update: ${relPath}`,
        content: contentBase64,
        branch: GITHUB_BRANCH,
        ...(existingSha ? { sha: existingSha } : {})
      })
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      console.error('GitHub Sync error:', errJson.message || putRes.statusText);
      return false;
    }

    console.log(`Successfully synced ${relPath} to GitHub repository!`);
    return true;
  } catch (err) {
    console.error('Error syncing to GitHub:', err);
    return false;
  }
}

export async function readData(key) {
  const { primary, tmp, relPath } = getFilePath(key);

  // In Vercel / Production serverless mode, fetch live data from GitHub first
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      const headers = { 'Cache-Control': 'no-cache' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${relPath}?t=${Date.now()}`;
      const ghRes = await fetch(rawUrl, { headers, cache: 'no-store' });
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        if (ghData) {
          // Cache in /tmp for fast subsequent reads on this lambda container
          try {
            const tmpDirPath = path.dirname(tmp);
            if (!fs.existsSync(tmpDirPath)) fs.mkdirSync(tmpDirPath, { recursive: true });
            fs.writeFileSync(tmp, JSON.stringify(ghData, null, 2), 'utf8');
          } catch (_) {}
          return ghData;
        }
      }
    } catch (error) {
      console.warn(`[readData] GitHub raw fetch failed for ${key}, falling back to local files:`, error.message);
    }
  }

  // Local / Fallback file reads
  try {
    if (fs.existsSync(tmp)) {
      const tmpData = fs.readFileSync(tmp, 'utf8');
      return JSON.parse(tmpData);
    }

    if (fs.existsSync(primary)) {
      const fileData = fs.readFileSync(primary, 'utf8');
      return JSON.parse(fileData);
    }

    return null;
  } catch (error) {
    console.error(`Error reading ${key} database:`, error);
    return null;
  }
}

export async function writeData(key, data, userGithubToken = null) {
  const { primary, tmp, relPath } = getFilePath(key);

  // 1. Try writing locally or to /tmp
  try {
    const dirPath = path.dirname(primary);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(primary, JSON.stringify(data, null, 2), 'utf8');

    try {
      const tmpDirPath = path.dirname(tmp);
      if (!fs.existsSync(tmpDirPath)) fs.mkdirSync(tmpDirPath, { recursive: true });
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    } catch (_) {}
  } catch (error) {
    if (error.code === 'EROFS' || error.code === 'EACCES' || (error.message && error.message.includes('read-only'))) {
      try {
        const tmpDirPath = path.dirname(tmp);
        if (!fs.existsSync(tmpDirPath)) {
          fs.mkdirSync(tmpDirPath, { recursive: true });
        }
        fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
      } catch (tmpErr) {
        console.error(`Error writing ${key} to /tmp:`, tmpErr);
      }
    }
  }

  // 2. Sync to GitHub repository if token is available
  let metaData = null;
  if (key.toLowerCase() === 'metadata') {
    metaData = data;
  } else {
    try {
      metaData = await readData('metadata');
    } catch (_) {}
  }

  const token = userGithubToken || metaData?.githubToken || process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  let synced = false;
  if (token) {
    synced = await syncToGitHub(relPath, data, token);
  }

  if (!token) {
    return {
      success: true,
      synced: false,
      warning: 'Warning: GITHUB_TOKEN is not configured! Changes are temporarily saved in server memory, but to persist changes permanently on Vercel across all users and tabs, set GITHUB_TOKEN in your Vercel Environment Variables or in Admin Details.'
    };
  }

  if (!synced) {
    return {
      success: true,
      synced: false,
      warning: 'Warning: Failed to sync changes to GitHub repository. Please check your GITHUB_TOKEN permissions and repository details.'
    };
  }

  return {
    success: true,
    synced: true
  };
}

