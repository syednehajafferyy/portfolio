import fs from 'fs';
import path from 'path';
import os from 'os';

const DB_DIR = path.join(process.cwd(), 'database');
const TMP_DB_DIR = path.join(os.tmpdir(), 'database');

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'syednehajafferyy';
const GITHUB_REPO = process.env.GITHUB_REPO || 'portfolio';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

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
      }
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
  try {
    const { primary, tmp } = getFilePath(key);

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

  let localWritten = false;

  // 1. Try writing locally or to /tmp
  try {
    const dirPath = path.dirname(primary);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(primary, JSON.stringify(data, null, 2), 'utf8');
    localWritten = true;

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
        localWritten = true;
      } catch (tmpErr) {
        console.error(`Error writing ${key} to /tmp:`, tmpErr);
      }
    }
  }

  // 2. Sync to GitHub repository if token is available
  const metaData = key.toLowerCase() === 'metadata' ? data : await readData('metadata');
  const token = userGithubToken || metaData?.githubToken || process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (token) {
    await syncToGitHub(relPath, data, token);
  }

  return true;
}
