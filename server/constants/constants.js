// @ts-check

/**
 * @param {any} param
 * @returns {import('../types/typedefs').GenericResponseError}
 */
export const getInvalidIdMessage = (param) => ({
    success: false,
    error: {
        message: `${param} is not a valid id.`
    }
});
