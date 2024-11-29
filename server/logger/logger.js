// @ts-check

export const LogType = Object.freeze({
    debug: 1,
    info: 2,
    error: 3,
    fatal: 4
});

const Color = Object.freeze({
    info: '\u001b[36m',
    debug: '\u001b[33m',
    error: '\u001b[31m',
    fatal: '\u001b[31m',
    reset: '\u001b[0m'
});

class Logger {
    /** @property {LogType[keyof typeof LogType]} level */
    level;

    /** @param {LogType[keyof typeof LogType]} level */
    constructor(level) {
        if (level > LogType.fatal) {
            throw new Error(`Max error level is ${LogType.fatal}`);
        }

        this.level = level;
    }

    debug(...msg) {
        if (this.level > LogType.debug) return;
        console.debug(new Date(), Color.debug, '[DEBUG]', Color.reset, ...msg);
    }

    info(...msg) {
        if (this.level > LogType.info) return;
        console.info(new Date(), Color.info, '[INFO]', Color.reset, ...msg);
    }

    error(...msg) {
        if (this.level > LogType.error) return;
        console.error(new Date(), Color.error, '[ERROR]', Color.reset, ...msg);
    }

    fatal(...msg) {
        console.error(new Date(), Color.fatal, '[FATAL]', Color.reset, ...msg);
    }
}

const logger = new Logger(LogType.info);

export default logger;
