import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    documentId: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['pdf', 'csv', 'txt'],
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    extractedText: {
      type: String
    },
    chunkCount: {
      type: Number,
      default: 0
    },
    metadata: {
      uploadDate: Date,
      originalName: String
    }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
