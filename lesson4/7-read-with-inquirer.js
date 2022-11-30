import inquirer from "inquirer";
import fsp from 'fs/promises';
import path from 'path';

const __dirname = 'D:/Education/5_MVP бизнес-проекта/5.2_NodeJS/node-lessons/lesson4';

fsp
    .readdir(path.join(__dirname))
    .then(async (inDir) => {
        const list = [];
        for (const item of inDir) {
            const src = await fsp.stat(item); // метод stat вытащит item из списка того, что находится в директории (файл или папку)
            if (src.isFile()) list.push(item);
        }
        return list;
    })
    .then((list) => {
        return inquirer
            .prompt({ // возвращает промис, когда мы его будем обрабатывать - он вернет объект
                name: 'fileName',
                type: 'list', // бывают: input, number, confirm, list, rawlist, expand, checkbox, password
                message: 'Choose file',
                choices: list,
            })
    })
    .then(({ fileName }) => fsp.readFile(fileName, 'utf-8'))
    .then(console.log);