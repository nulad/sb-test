'use strict';

const redis = require('redis');
const Promise = require('bluebird');
const { EventEmitter } = require('events')

class Lock {
    constructor() {
        this.redis = null;
        this.lock = 'lock';
        this.ee = new EventEmitter();
    }

    async getRedisInstance() {
        if (!this.redis) {
            this.redis = Promise.promisifyAll(redis.createClient({
                url: 'url-to-redis'
            }));
        }
        return this.redis;
    }

    async getLock() {
        const client = await getRedisInstance();
        const isLocked = await client.getAsync(this.lock);
        if (isLocked) {
            return true;
        } else {
            return false;
        }
    }

    async lock() {
        const client = await getRedisInstance();
        await client.setAsync(this.lock, 'true', 'EX', 30);
    }

    async release() {
        const client = await getRedisInstance();
        await client.delAsync(this.lock);
    }

    async acquire() {
        return new Promise(resolve => {
            const isLocked = await this.getLock();
            if (!isLocked) {
                await this.lock();
                return resolve();
            }

            // Otherwise, wait until somebody releases the lock and try again
            const tryAcquire = () => {
                const isLocked = await this.getLock();
                if (!isLocked) {
                    await this.lock();
                    this.ee.removeListener('release', tryAcquire);
                    return resolve();
                }
            };
            this.ee.on('release', tryAcquire);
        });
    }

    release() {
        await this.release();
        setImmediate(() => this._ee.emit('release'));
    }
}

module.exports = Lock;
