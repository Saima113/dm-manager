// elasticsearch.js
const { Client } = require('@elastic/elasticsearch');

// Create Elasticsearch client
const elasticClient = new Client({
  node: 'http://localhost:9200'  // Default Elasticsearch address
});

// Initialize Elasticsearch (create index)
async function initializeElasticsearch() {
  try {
    // Check if index exists
    const indexExists = await elasticClient.indices.exists({
      index: 'linkedin_messages'
    });

    if (!indexExists) {
      // Create index with mappings
      await elasticClient.indices.create({
        index: 'linkedin_messages',
        body: {
          mappings: {
            properties: {
              sender: { type: 'text' },
              content: { type: 'text' },
              timestamp: { type: 'date' },
              priority: { type: 'keyword' }
            }
          }
        }
      });
      console.log('Elasticsearch index created successfully');
    }
  } catch (error) {
    console.error('Elasticsearch initialization error:', error);
  }
}

initializeElasticsearch();

// Export client for use in other files
module.exports = elasticClient;