export type GenericResponseSuccess = {
    success: true;
    message?: string;
};

export type GenericResponseError<E = { message: string }> = {
    success: false;
    statusCode?: number;
    error: E;
};

export type GenericResponse<
    R extends object = Record<string, unknown>,
    E = { message: string } | string,
> = (GenericResponseSuccess & R) | GenericResponseError<E>;

// Requests
export type UserRegisterRequest = {
    email: string;
    username: string;
    password: string;
};

export type UserLoginRequest = {
    email: string;
    password: string;
};
