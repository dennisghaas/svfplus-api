require('dotenv').config();
const { Redis } = require('@upstash/redis');

// Redis-Konfiguration
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = redis;