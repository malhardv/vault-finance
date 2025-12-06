import pdfParse from 'pdf-parse';
import csv from 'csv-parser';
import { Readable } from 'stream';

/**
 * Parse a bank statement file (PDF or CSV) and extract transactions
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} mimetype - The file mimetype
 * @returns {Promise<Array>} Array of transaction objects
 */
export const parseFile = async (fileBuffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    return await parsePDF(fileBuffer);
  } else if (mimetype === 'text/csv' || mimetype === 'application/csv') {
    return await parseCSV(fileBuffer);
  } else {
    throw new Error('Unsupported file format. Only PDF and CSV files are supported.');
  }
};

/**
 * Parse PDF bank statement
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<Array>} Array of transaction objects
 */
const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    const text = data.text;
    
    const transactions = [];
    const lines = text.split('\n');
    
    // Regex patterns for extracting transaction data
    // Pattern matches: date, description, amount (debit/credit), balance
    // Example formats:
    // "01/12/2023 ZOMATO PAYMENT 450.00 Dr 25,550.00"
    // "15/12/2023 SALARY CREDIT 50000.00 Cr 75,550.00"
    const transactionPattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([\d,]+\.?\d*)\s*(Dr|Cr|Debit|Credit|debit|credit)?\s*([\d,]+\.?\d*)?/i;
    
    for (const line of lines) {
      const match = line.match(transactionPattern);
      
      if (match) {
        const [, dateStr, description, amountStr, typeStr, balanceStr] = match;
        
        // Parse date (handle multiple formats)
        const date = parseDate(dateStr);
        
        // Parse amount
        const amount = parseFloat(amountStr.replace(/,/g, ''));
        
        // Determine transaction type
        let type = 'debit';
        if (typeStr) {
          const typeNormalized = typeStr.toLowerCase();
          if (typeNormalized.includes('cr') || typeNormalized === 'credit') {
            type = 'credit';
          }
        }
        
        // Parse balance if available
        const balance = balanceStr ? parseFloat(balanceStr.replace(/,/g, '')) : null;
        
        // Only add if we have valid data
        if (date && description.trim() && !isNaN(amount)) {
          transactions.push({
            date,
            description: description.trim(),
            amount,
            type,
            balance
          });
        }
      }
    }
    
    return transactions;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Parse CSV bank statement
 * @param {Buffer} buffer - CSV file buffer
 * @returns {Promise<Array>} Array of transaction objects
 */
const parseCSV = async (buffer) => {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const stream = Readable.from(buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Common CSV column names (case-insensitive matching)
          const dateField = findField(row, ['date', 'transaction date', 'txn date', 'posting date']);
          const descField = findField(row, ['description', 'narration', 'particulars', 'details']);
          const amountField = findField(row, ['amount', 'transaction amount', 'txn amount']);
          const debitField = findField(row, ['debit', 'withdrawal', 'debit amount']);
          const creditField = findField(row, ['credit', 'deposit', 'credit amount']);
          const typeField = findField(row, ['type', 'transaction type', 'txn type']);
          const balanceField = findField(row, ['balance', 'closing balance', 'available balance']);
          
          // Extract values
          const dateStr = dateField ? row[dateField] : null;
          const description = descField ? row[descField] : null;
          
          // Determine amount and type
          let amount = null;
          let type = 'debit';
          
          if (amountField && row[amountField]) {
            amount = parseFloat(row[amountField].toString().replace(/,/g, ''));
            
            // Check type field if available
            if (typeField && row[typeField]) {
              const typeValue = row[typeField].toString().toLowerCase();
              if (typeValue.includes('cr') || typeValue === 'credit') {
                type = 'credit';
              }
            }
          } else if (debitField && row[debitField]) {
            amount = parseFloat(row[debitField].toString().replace(/,/g, ''));
            type = 'debit';
          } else if (creditField && row[creditField]) {
            amount = parseFloat(row[creditField].toString().replace(/,/g, ''));
            type = 'credit';
          }
          
          const balance = balanceField && row[balanceField] 
            ? parseFloat(row[balanceField].toString().replace(/,/g, '')) 
            : null;
          
          // Parse date
          const date = dateStr ? parseDate(dateStr) : null;
          
          // Only add if we have valid data
          if (date && description && !isNaN(amount)) {
            transactions.push({
              date,
              description: description.trim(),
              amount,
              type,
              balance
            });
          }
        } catch (error) {
          // Skip invalid rows
          console.warn('Skipping invalid CSV row:', error.message);
        }
      })
      .on('end', () => {
        resolve(transactions);
      })
      .on('error', (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      });
  });
};

/**
 * Find a field in a row object using multiple possible field names (case-insensitive)
 * @param {Object} row - CSV row object
 * @param {Array<string>} possibleNames - Array of possible field names
 * @returns {string|null} The matching field name or null
 */
const findField = (row, possibleNames) => {
  const keys = Object.keys(row);
  for (const name of possibleNames) {
    const match = keys.find(key => key.toLowerCase() === name.toLowerCase());
    if (match) return match;
  }
  return null;
};

/**
 * Parse date string into Date object
 * Handles multiple date formats: DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY, YYYY-MM-DD
 * @param {string} dateStr - Date string
 * @returns {Date|null} Parsed date or null
 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  // Try ISO format first (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
  }
  
  // Try DD/MM/YYYY or DD-MM-YYYY format
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (ddmmyyyyMatch) {
    let [, day, month, year] = ddmmyyyyMatch;
    
    // Convert 2-digit year to 4-digit
    if (year.length === 2) {
      year = parseInt(year) > 50 ? `19${year}` : `20${year}`;
    }
    
    // Assume DD/MM/YYYY format (common in bank statements)
    const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    if (!isNaN(date.getTime())) return date;
  }
  
  return null;
};

export default { parseFile };
