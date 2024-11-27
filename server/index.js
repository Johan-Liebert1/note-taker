import Express from "express";
import { configDotenv } from "dotenv";
import { resolve, join } from "node:path";
import { exit } from "node:process";
import userRouter from "./users.js";
import { Sequelize } from "sequelize";

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

const connectDB = () => {
    const sequelize = new Sequelize(
        process.env.MYSQL_DATABASE,
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD,
        {
            host: "127.0.0.1",
            port: 3306,
            dialect: "mysql",
        },
    );

    sequelize
        .authenticate()
        .then(() => {
            console.log("Connection has been established successfully.");
        })
        .catch((error) => {
            console.error("Unable to connect to the database:", error);
        });
};

const main = () => {
    loadEnvironment();
    connectDB();

    const app = Express();

    app.use("/users", userRouter);

    app.listen(process.env.PORT, () => {
        console.log(`Started server on port ${process.env.PORT}`);
    });
};

main();
