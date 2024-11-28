// @ts-check

/**
 * @param {unknown} error
 * @returns {string}
 */
export const getErrorMessage = (error) =>
    `${error instanceof Error ? error.message : String(error)}`;
