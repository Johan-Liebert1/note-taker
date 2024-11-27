import Express from "express";
import { configDotenv } from "dotenv";
import { resolve, join } from "node:path";
import { exit } from "node:process";
import userRouter from "./users";

const loadEnvironment = () => {
    const BASE_PATH = resolve(".");

    const output = configDotenv({
        path: join(BASE_PATH, "server/.env"),
    });

    if (output.error) {
        console.error(output.error);
        exit(1);
    }
};

const main = () => {
    loadEnvironment();

    const app = Express();

    app.use("/users", userRouter);

    app.listen(process.env.PORT, () => {
        console.log(`Started server on port ${process.env.PORT}`);
    });
};

main();
