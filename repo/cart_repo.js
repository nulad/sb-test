'use strict';

const redis = require('redis');
const Promise = require('bluebird');

class CartRepository {
    constructor() {
        this.redis = null;
    }

    async getRedisInstance() {
        if (!this.redis) {
            this.redis = Promise.promisifyAll(redis.createClient({
                url: 'url-to-redis'
            }));
        }
        return this.redis;
    }

    async checkout(id, payload) {
        const client = await getRedisInstance();
        await client.set(id, payload);
        return id;
    }

    async get(id) {
        const client = await getRedisInstance();
        return client.get(id);
    }
}

module.exports = CartRepository;
