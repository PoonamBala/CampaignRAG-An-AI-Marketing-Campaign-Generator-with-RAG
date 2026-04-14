import { cosineSimilarity } from './embeddings.js';

/**
 * In-memory vector store for storing and searching embeddings
 * Can be replaced with FAISS, Pinecone, Weaviate, etc.
 */
class VectorStore {
  constructor() {
    this.vectors = []; // Array of {id, embedding, metadata}
  }

  /**
   * Add vector to store
   * @param {string} id - Unique identifier
   * @param {Array<number>} embedding - Embedding vector
   * @param {Object} metadata - Additional metadata
   */
  add(id, embedding, metadata = {}) {
    // Remove existing vector with same ID
    this.vectors = this.vectors.filter((v) => v.id !== id);

    this.vectors.push({
      id,
      embedding,
      metadata
    });
  }

  /**
   * Batch add vectors
   * @param {Array<Object>} items - Array of {id, embedding, metadata}
   */
  addBatch(items) {
    items.forEach(({ id, embedding, metadata }) => {
      this.add(id, embedding, metadata);
    });
  }

  /**
   * Search for similar vectors
   * @param {Array<number>} queryEmbedding - Query embedding vector
   * @param {number} k - Number of results to return
   * @returns {Array<Object>} Top k similar vectors with scores
   */
  search(queryEmbedding, k = 5) {
    if (this.vectors.length === 0) {
      return [];
    }

    // Calculate similarity for all vectors
    const results = this.vectors
      .map((vector) => ({
        id: vector.id,
        score: cosineSimilarity(queryEmbedding, vector.embedding),
        metadata: vector.metadata
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, k); // Get top k

    return results;
  }

  /**
   * Get vector by ID
   * @param {string} id - Vector ID
   * @returns {Object|null} Vector object or null
   */
  get(id) {
    return this.vectors.find((v) => v.id === id) || null;
  }

  /**
   * Delete vector by ID
   * @param {string} id - Vector ID
   * @returns {boolean} True if deleted, false if not found
   */
  delete(id) {
    const initialLength = this.vectors.length;
    this.vectors = this.vectors.filter((v) => v.id !== id);
    return this.vectors.length < initialLength;
  }

  /**
   * Delete all vectors for a document
   * @param {string} documentId - Document ID to filter
   * @returns {number} Number of vectors deleted
   */
  deleteByDocumentId(documentId) {
    const initialLength = this.vectors.length;
    this.vectors = this.vectors.filter(
      (v) => v.metadata.documentId !== documentId
    );
    return initialLength - this.vectors.length;
  }

  /**
   * Get all vectors for a document
   * @param {string} documentId - Document ID
   * @returns {Array<Object>} All vectors for the document
   */
  getByDocumentId(documentId) {
    return this.vectors.filter(
      (v) => v.metadata.documentId === documentId
    );
  }

  /**
   * Get store statistics
   * @returns {Object} Statistics about the vector store
   */
  getStats() {
    return {
      totalVectors: this.vectors.length,
      documents: [...new Set(this.vectors.map((v) => v.metadata.documentId))]
        .length
    };
  }

  /**
   * Clear all vectors
   */
  clear() {
    this.vectors = [];
  }
}

// Global vector store instance
const globalVectorStore = new VectorStore();

export default globalVectorStore;
export { VectorStore };
