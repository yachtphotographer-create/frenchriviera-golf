/**
 * Security utilities
 */

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for HTML output
 */
function escapeHtml(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Validate that a value is a positive integer
 * @param {any} value - Value to validate
 * @returns {number|null} - Valid integer or null
 */
function validateId(value) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        return null;
    }
    return num;
}

/**
 * Generate a cryptographically secure random token
 * @param {number} length - Length in bytes (output will be 2x in hex)
 * @returns {string} - Random hex string
 */
function generateSecureToken(length = 32) {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
}

module.exports = {
    escapeHtml,
    validateId,
    generateSecureToken
};
