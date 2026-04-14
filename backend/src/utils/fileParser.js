import fs from 'fs';
import pdfParse from 'pdf-parse';
import Papa from 'papaparse';

/**
 * Extract text from uploaded file
 * @param {string} filePath - Path to the uploaded file
 * @param {string} fileType - Type of file (pdf, csv, txt)
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromFile = async (filePath, fileType) => {
  try {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return await extractFromPDF(filePath);
      case 'csv':
        return await extractFromCSV(filePath);
      case 'txt':
        return await extractFromTXT(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    throw new Error(`Error extracting text from ${fileType}: ${error.message}`);
  }
};

/**
 * Extract text from PDF file
 */
const extractFromPDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  return data.text;
};

/**
 * Extract text from CSV file
 */
const extractFromCSV = async (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      complete: (results) => {
        // Convert CSV to readable text
        const text = results.data
          .map((row) => row.join(' | '))
          .join('\n');
        resolve(text);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Extract text from TXT file
 */
const extractFromTXT = async (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};
