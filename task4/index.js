// Напишите программу, которая находит в файле access_tmp.log 
// все записи с ip-адресами 89.123.1.41 и 34.48.240.111, 
// а также сохраняет их в отдельные файлы с названием %ip-адрес%_requests.log.
"use strict";
import fs from 'fs';
import readline from 'readline';

const ACCESS_LOG = './task4/access_tmp.log';
const IP1_LOG = './task4/89.123.1.41_requests.log';
const IP2_LOG = './task4/34.48.240.111_requests.log';
const IP1 = '89.123.1.41';
const IP2 = '34.48.240.111';

async function processLineByLine() {
    const fileStream = fs.createReadStream(ACCESS_LOG);

    const rl = readline.createInterface({
        input: fileStream,
    });

    for await (const line of rl) {
        if (line.indexOf(IP1) != '-1') {
            fs.appendFile(IP1_LOG, line + '\n', 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        if (line.indexOf(IP2) != '-1') {
            fs.appendFile(IP2_LOG, line + '\n', 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
};

processLineByLine();