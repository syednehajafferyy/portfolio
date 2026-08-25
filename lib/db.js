import fs from 'fs';
import path from 'path';
import os from 'os';

const DB_DIR = path.join(process.cwd(), 'database');
const TMP_DB_DIR = path.join(os.tmpdir(), 'database');

const getFilePath = (fileName) => {
  if (fileName.toLowerCase() === 'metadata') {
    return {
      primary: path.join(DB_DIR, 'config', 'metadata.json'),
      tmp: path.join(TMP_DB_DIR, 'config', 'metadata.json')
    };
  }
  return {
    primary: path.join(DB_DIR, `${fileName}.json`),
    tmp: path.join(TMP_DB_DIR, `${fileName}.json`)
  };
};

export async function readData(key) {
  try {
    const { primary, tmp } = getFilePath(key);

    // 1. If modified version exists in writable /tmp (Vercel / serverless environment), read from /tmp
    if (fs.existsSync(tmp)) {
      const tmpData = fs.readFileSync(tmp, 'utf8');
      return JSON.parse(tmpData);
    }

    // 2. Fall back to bundled static database file
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

export async function writeData(key, data) {
  const { primary, tmp } = getFilePath(key);

  // Try writing to local project directory first (works in local dev / traditional server)
  try {
    const dirPath = path.dirname(primary);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(primary, JSON.stringify(data, null, 2), 'utf8');

    // Sync to /tmp if possible
    try {
      const tmpDirPath = path.dirname(tmp);
      if (!fs.existsSync(tmpDirPath)) fs.mkdirSync(tmpDirPath, { recursive: true });
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    } catch (_) {}

    return true;
  } catch (error) {
    // If read-only file system (e.g. Vercel / AWS Lambda serverless function)
    if (error.code === 'EROFS' || error.code === 'EACCES' || (error.message && error.message.includes('read-only'))) {
      try {
        const tmpDirPath = path.dirname(tmp);
        if (!fs.existsSync(tmpDirPath)) {
          fs.mkdirSync(tmpDirPath, { recursive: true });
        }
        fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
        return true;
      } catch (tmpErr) {
        console.error(`Error writing ${key} to /tmp fallback:`, tmpErr);
        throw tmpErr;
      }
    }
    console.error(`Error writing ${key} database:`, error);
    throw error;
  }
}
