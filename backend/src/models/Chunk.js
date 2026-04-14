import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number],
      required: true
    },
    chunkIndex: {
      type: Number,
      required: true
    },
    metadata: {
      startChar: Number,
      endChar: Number,
      filename: String
    }
  },
  {
    timestamps: true
  }
);

const Chunk = mongoose.model('Chunk', chunkSchema);

export default Chunk;
