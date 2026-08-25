import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'database');

const getFilePath = (fileName) => {
  if (fileName.toLowerCase() === 'metadata') {
    return path.join(DB_DIR, 'config', 'metadata.json');
  }
  return path.join(DB_DIR, `${fileName}.json`);
};

export async function readData(key) {
  try {
    const filePath = getFilePath(key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading ${key} database:`, error);
    return null;
  }
}

export async function writeData(key, data) {
  try {
    const filePath = getFilePath(key);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${key} database:`, error);
    throw error;
  }
}
