import { Jwt } from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            MYSQL_DATABASE: string;
            MYSQL_USER: string;
            MYSQL_PASSWORD: string;
        }
    }

    namespace Express {
        interface Request {
            decodedJwt: Jwt | undefined;
        }
    }
}
