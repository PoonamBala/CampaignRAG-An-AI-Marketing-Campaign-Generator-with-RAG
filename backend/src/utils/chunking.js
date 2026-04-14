/**
 * Split text into chunks
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Characters per chunk (default 500)
 * @param {number} overlap - Character overlap between chunks (default 50)
 * @returns {Array<string>} Array of text chunks
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.length === 0) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Try to break at a sentence boundary if possible
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > start + chunkSize * 0.7) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.substring(start, end).trim());

    // Move start position with overlap
    start = end - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 0);
};

/**
 * Create chunks with metadata
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Characters per chunk
 * @param {number} overlap - Character overlap
 * @returns {Array<Object>} Array of chunks with metadata
 */
export const createChunksWithMetadata = (text, chunkSize = 500, overlap = 50) => {
  const chunks = chunkText(text, chunkSize, overlap);
  let charPosition = 0;

  return chunks.map((chunk, index) => {
    const startChar = text.indexOf(chunk, charPosition);
    const endChar = startChar + chunk.length;
    charPosition = endChar;

    return {
      text: chunk,
      chunkIndex: index,
      metadata: {
        startChar,
        endChar
      }
    };
  });
};
