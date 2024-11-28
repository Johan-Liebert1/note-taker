declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            MYSQL_DATABASE: string;
            MYSQL_USER: string;
            MYSQL_PASSWORD: string;
        }
    }
}
