import fs from 'fs';
import path from 'path';

const fileName = process.argv[2];
const __dirname = 'D:/Education/5_MVP бизнес-проекта/5.2_NodeJS/node-lessons/lesson4';

fs.readFile(path.join(__dirname, fileName), 'utf-8', (err, data) => {
    console.log(data);
});