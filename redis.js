// In server.js or a separate redis.js file
const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const redisClient = redis.createClient({
  host: 'localhost',  // Default Redis address
  port: 6379         // Default Redis port
});

// Convert callback-based methods to promise-based
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Handle connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

// Export methods for use in other files
module.exports = {
  redisClient,
  getAsync,
  setAsync,
  delAsync
};