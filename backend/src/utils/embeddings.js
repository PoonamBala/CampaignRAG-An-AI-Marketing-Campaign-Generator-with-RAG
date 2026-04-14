/**
 * Generate embeddings for text
 * Using simple hash-based mock embeddings for now
 * Can be replaced with OpenAI, Hugging Face, etc.
 */

const EMBEDDING_DIMENSION = 384; // Common dimension for embeddings

/**
 * Generate deterministic embedding for text
 * Uses a simple hash function to create consistent embeddings
 * Replace with real embeddings (OpenAI, Hugging Face) in production
 * 
 * @param {string} text - Text to embed
 * @returns {Array<number>} Embedding vector
 */
export const generateEmbedding = (text) => {
  return generateMockEmbedding(text);
};

/**
 * Generate mock embeddings using simple hashing
 * Deterministic and consistent for testing
 */
const generateMockEmbedding = (text) => {
  const embedding = new Array(EMBEDDING_DIMENSION).fill(0);

  // Simple hash function to distribute text features
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    for (let j = 0; j < EMBEDDING_DIMENSION; j++) {
      embedding[j] += Math.sin((charCode * (j + 1)) / 128) * 0.1;
    }
  }

  // Normalize the vector
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitude > 0) {
    return embedding.map((val) => val / magnitude);
  }

  return embedding;
};

/**
 * Calculate cosine similarity between two vectors
 * @param {Array<number>} vec1 - First vector
 * @param {Array<number>} vec2 - Second vector
 * @returns {number} Similarity score (0-1)
 */
export const cosineSimilarity = (vec1, vec2) => {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Batch generate embeddings for multiple texts
 * @param {Array<string>} texts - Array of texts to embed
 * @returns {Promise<Array<Array<number>>>} Array of embeddings
 */
export const generateBatchEmbeddings = async (texts) => {
  return texts.map((text) => generateEmbedding(text));
};

/**
 * Configuration for real embeddings (OpenAI example)
 * To use real embeddings, uncomment and configure:
 */

/*
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateEmbeddingOpenAI = async (text) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
};
*/
