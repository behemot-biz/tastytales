/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  /**
   * Truncates a string to a specified length and appends ellipsis if needed.
   * @param {string} text - The text to truncate.
   * @param {number} maxLength - The maximum length of the truncated string.
   * @returns {string} - The truncated string.
   */
  export const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };