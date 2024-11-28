// @ts-check

/**
 * @param {unknown} error
 * @returns {string}
 */
export const getErrorMessage = (error) =>
    `${error instanceof Error ? error.message : String(error)}`;

/**
 * @param {string} str
 * @returns {import("../types/typedefs").GenericResponse<{ parsed: number; }>}
 */
export const parseAsInt = (str) => {
    if (Number.isNaN(str)) {
        return {
            success: false,
            error: {
                message: `${str} is not a valid number.`
            }
        };
    }

    if (!Number.isInteger(Number(str))) {
        return {
            success: false,
            error: {
                message: `${str} is not a valid integer.`
            }
        };
    }

    const parsed = Number.parseInt(str);

    return {
        success: true,
        parsed
    };
};
