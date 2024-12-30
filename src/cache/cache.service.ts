import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });
    this.logger.log('Redis client initialized');
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      if (value) {
        this.logger.log(`Cache hit for key: ${key}`);
      } else {
        this.logger.log(`Cache miss for key: ${key}`);
      }
      return value;
    } catch (error) {
      this.logger.error(`Failed to get key: ${key} from Redis`, error.stack);
      throw new Error('Error retrieving data from cache');
    }
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    try {
      await this.redisClient.set(key, value, 'EX', ttl);
      this.logger.log(`Key: ${key} set in cache with TTL: ${ttl} seconds`);
    } catch (error) {
      this.logger.error(`Failed to set key: ${key} in Redis`, error.stack);
      throw new Error('Error saving data to cache');
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      this.logger.log(`Key: ${key} deleted from cache`);
    } catch (error) {
      this.logger.error(`Failed to delete key: ${key} from Redis`, error.stack);
      throw new Error('Error deleting data from cache');
    }
  }
}
