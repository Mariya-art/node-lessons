import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';

const __dirname = 'D:/Education/5_MVP бизнес-проекта/5.2_NodeJS/node-lessons/lesson4';

const options = yargs(hideBin(process.argv))
    .usage('Usage: -p <path>')
    .option('p', { alias: 'path', describe: 'Path to file', demandOption: true })
    .argv;

const fileName = options.path;

fs.readFile(path.join(__dirname, fileName), 'utf-8', (err, data) => {
    console.log(data);
});
// при запуске через команду npm run dev -- -p access.log между командой и аргументами ставится знак --