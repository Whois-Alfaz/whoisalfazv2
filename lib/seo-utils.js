/**
 * Globally replaces the backend URL (https://v1.whoisalfaz.me) with the frontend URL (https://whoisalfaz.me).
 * This ensures that no backend links, canonicals, or schema IDs leak into the production site.
 * 
 * @param {string} content - The string content (HTML, JSON, or plain text) to sanitize.
 * @returns {string} - The sanitized string with all backend references replaced.
 */
export function replaceBackendUrl(content) {
    if (!content) return '';
    if (typeof content !== 'string') return content;

    // Replace both http and https versions of the backend URL
    return content.replace(/https?:\/\/v1\.whoisalfaz\.me/g, 'https://whoisalfaz.me');
}
