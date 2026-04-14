import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.csv', '.txt'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, CSV, and TXT files are allowed.'));
  }
};

// Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

export const uploadSingle = upload.single('file');
