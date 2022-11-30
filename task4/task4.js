#!/usr/bin/env node

// Превратите программу из task3 в консольное приложение и добавьте следующие функции:
// 1. Возможность передавать путь к директории в программу. Это актуально, когда вы не хотите
// покидать текущую директорию, но надо просмотреть файл, находящийся в другом месте.
// 2. В директории переходить во вложенные каталоги.
// 3. Во время чтения файлов искать в них заданную строку или паттерн

import readline from 'readline';
import colors from 'colors';
import path from 'path';
import inquirer from 'inquirer';
import fsp from 'fs/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const directory = process.cwd();

const findFilesInDir = (dirName) => {
    return fsp
        .readdir(dirName)
        .then((choices) => {
            return inquirer.prompt([
                {
                name: 'fileName',
                type: 'list',
                message: 'Выберите файл',
                choices,
                },
                {
                name: 'findString',
                type: 'input',
                message: 'Введите текст, который хотите найти',
                },
            ]);
        })
        .then(async ({ fileName, findString }) => {
            const fullPath = path.join(dirName, fileName);
            const stat = await fsp.stat(fullPath);
            if (!stat.isFile()) {
                return findFilesInDir(fullPath);
            }
            return Promise.all([
                fsp.readFile(fullPath, 'utf-8'),
                Promise.resolve(findString),
            ]);
        })
        .then((result) => {
            if (result) {
                const [text, findString] = result;
                const pattern = new RegExp(findString, 'g');
                let count = 0;
                const out = text.replace(pattern, () => {
                count++;
                return colors.red(findString);
                });

                console.log(out, '\n', colors.green(`Найдено ${count} значений`));
            }
        });
};

rl.question(
    `Вы в директории: ${directory} \n Укажите название папки, которая находится в этой директории: `,
    (dirPath) => {
        const dirName = path.join(directory, dirPath);

        findFilesInDir(dirName);
    }
);

rl.on('close', () => process.exit(0));