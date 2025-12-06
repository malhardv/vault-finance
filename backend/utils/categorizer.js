import CategoryRule from '../models/CategoryRule.js';

/**
 * Categorize a transaction based on its description
 * Matches keywords from CategoryRule collection against the description
 * @param {string} description - Transaction description
 * @returns {Promise<string>} Category name or "Uncategorized"
 */
export const categorizeTransaction = async (description) => {
  if (!description || typeof description !== 'string') {
    return 'Uncategorized';
  }
  
  // Normalize description to lowercase for case-insensitive matching
  const normalizedDescription = description.toLowerCase();
  
  try {
    // Fetch all category rules from database
    const rules = await CategoryRule.find().sort({ priority: -1 });
    
    // Find the first matching rule
    for (const rule of rules) {
      // Check if the keyword appears in the description
      if (normalizedDescription.includes(rule.keyword)) {
        return rule.category;
      }
    }
    
    // No match found
    return 'Uncategorized';
  } catch (error) {
    console.error('Error categorizing transaction:', error);
    return 'Uncategorized';
  }
};

export default { categorizeTransaction };
