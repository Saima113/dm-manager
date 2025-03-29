
const redis = require('redis');
const { promisify } = require('util');

// Creating Redis client
const redisClient = redis.createClient({
  host: 'localhost',  // Default Redis address
  port: 6379         // Default Redis port
});

// Converting callback-based methods to promise-based
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Handling connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis client not connected ; error:', error);
});

// Export methods for use in other files
module.exports = {
  redisClient,
  getAsync,
  setAsync,
  delAsync
};