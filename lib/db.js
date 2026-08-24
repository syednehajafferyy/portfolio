import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'database');

const getFilePath = (fileName) => {
  if (fileName === 'metadata') {
    return path.join(DB_DIR, 'config', 'metadata.json');
  }
  return path.join(DB_DIR, `${fileName}.json`);
};

export async function readData(key) {
  try {
    const filePath = getFilePath(key);
    const fileData = await fs.promises.readFile(filePath, 'utf8');
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
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${key} database:`, error);
    return false;
  }
}
