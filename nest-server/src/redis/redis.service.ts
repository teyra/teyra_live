import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig, redisClusterConfig } from './config';
@Injectable()
export class RedisService {
  private client: any;
  constructor() {
    this.getClient();
  }
  private async getClient(connectType?: string) {
    if (connectType && connectType === 'cluster') {
      const cluster = new Redis.Cluster(redisClusterConfig);
      this.client = cluster;
      cluster.on('error', (err) => console.log('Redis cluster Error', err));
      cluster.on('connect', () => console.log('redis集群连接成功'));
    } else {
      const redis = new Redis(redisConfig);
      this.client = redis;
      redis.on('error', (err) => console.log('Redis cluster Error', err));
      redis.on('connect', () => console.log('redis连接成功'));
    }
  }
  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    let data = await this.client.get(key);

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   * @return:
   */
  public async del(key: string): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    await this.client.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  public async flushall(): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    await this.client.flushall();
  }
}
