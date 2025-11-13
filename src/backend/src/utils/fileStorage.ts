import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '../../../../data/db');

// Generic file storage class
export class FileStorage<T extends { id: string }> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(DB_DIR, fileName);
    this.ensureDbDir();
  }

  private ensureDbDir() {
    if (!existsSync(DB_DIR)) {
      mkdir(DB_DIR, { recursive: true }).catch(err => {
        logger.error(`Failed to create DB directory: ${err.message}`);
      });
    }
  }

  // Read all records
  async read(): Promise<T[]> {
    try {
      if (!existsSync(this.filePath)) {
        // Create empty file if doesn't exist
        await this.write([]);
        return [];
      }

      const data = await readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data, (key, value) => {
        // Revive Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
          return new Date(value);
        }
        return value;
      });
      return parsed || [];
    } catch (error: any) {
      logger.error(`Error reading from ${this.filePath}: ${error.message}`);
      return [];
    }
  }

  // Write all records
  async write(data: T[]): Promise<void> {
    try {
      const json = JSON.stringify(data, null, 2);
      await writeFile(this.filePath, json, 'utf-8');
    } catch (error: any) {
      logger.error(`Error writing to ${this.filePath}: ${error.message}`);
      throw error;
    }
  }

  // Find one record
  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const data = await this.read();
    return data.find(predicate) || null;
  }

  // Find multiple records
  async findMany(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.read();
    return data.filter(predicate);
  }

  // Create new record
  async create(record: T): Promise<T> {
    const data = await this.read();
    data.push(record);
    await this.write(data);
    logger.info(`Created new record in ${path.basename(this.filePath)}: ${record.id}`);
    return record;
  }

  // Update record
  async update(predicate: (item: T) => boolean, updates: T): Promise<T | null> {
    const data = await this.read();
    const index = data.findIndex(predicate);
    
    if (index === -1) {
      return null;
    }

    data[index] = updates;
    await this.write(data);
    logger.info(`Updated record in ${path.basename(this.filePath)}: ${updates.id}`);
    return updates;
  }

  // Delete record
  async delete(predicate: (item: T) => boolean): Promise<boolean> {
    const data = await this.read();
    const index = data.findIndex(predicate);
    
    if (index === -1) {
      return false;
    }

    const deleted = data.splice(index, 1);
    await this.write(data);
    logger.info(`Deleted record from ${path.basename(this.filePath)}: ${deleted[0].id}`);
    return true;
  }
}
