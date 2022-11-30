"use strict";
import fs from 'fs';
import fsp from 'fs/promises';
import { Transform } from 'stream';

const ACCESS_LOG = './lesson3/access.log';

//* ЧТЕНИЕ
// const data = fs.readFileSync(ACCESS_LOG);
// console.log(data); // показывает Buffer (набор байт)
// console.log(data.toString()); // в читаемом формате

//* Синхронное чтение
// const data = fs.readFileSync(ACCESS_LOG, {
//     encoding: 'utf-8',
// });
// или
// const data = fs.readFileSync(ACCESS_LOG, 'utf-8'); // короткий вариант записи
// console.log(data);

//* Асинхронное чтение (во время чтения поток не будет заблокирован, после прочтения сработает коллбэк)
// fs.readFile(ACCESS_LOG, 'utf-8', (err, data) => {
//     if(err) console.log(err);
//     else console.log(data);
// });

//* Промисификация (чтение)
// fsp.readFile(ACCESS_LOG, 'utf-8')
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     });

//* ЗАПИСЬ
const requests = [
    '127.0.0.1 - - [10/Jan/2022:11:11:20 -0300] "GET /foo HTTP/1.1" 200 0 "-" "curl/7.47.0"',
    '127.0.0.1 - - [10/Jan/2022:11:11:20 -0300] "POST /foo HTTP/1.1" 200 0 "-" "curl/7.47.0"',
];

//* Асинхронная запись
// fs.writeFile(
//     ACCESS_LOG, 
//     requests[0] + '\n', 
//     {
//         encoding: 'utf-8',
//         flag: 'a', // чтобы добавить новую строку, а не перезаписать весь файл
//     }, 
//     (err) => {
//         if (err) console.log(err);
//     });
//или
// fs.appendFile(); // дополняет файл, а не перезаписывает (в этом случае не нужно использовать флаги)

//* ЧТЕНИЕ ЧЕРЕЗ ПОТОКИ
// fs.ReadStream(); // чтение потока
// или удобнее:
const readStream = fs.createReadStream(ACCESS_LOG, {    // функция, которая создает поток
    encoding: 'utf-8',
    // autoClose: true, // когда закончится чтение, поток автоматически закроется
    // start: 1024, // начало и конец чтения (в байтах)
    // end: 2048,
    // flags: '', // флаги можно перечислить
    highWaterMark: 64, // размер передаваемых порций (в байтах)
});

// readStream.on('data', chunk => {    // слушатель на событие data (чтение данных)
//     console.log('chunk:', chunk);
// });

// readStream.on('end', () => console.log('File reading is finished')); // когда чтение файла закончено
// readStream.on('error', err => console.error(err.message)); // обработка ошибок

//* ЗАПИСЬ ЧЕРЕЗ ПОТОКИ
const writeStream = fs.createWriteStream(ACCESS_LOG, {
    encoding: 'utf-8',
    flags: 'a',
});

// requests.forEach((logString) => {
//     writeStream.write(logString + '\n');
// });

// writeStream.end(); // заканчиваем писать в файл и он закрывается
// writeStream.end(() => console.log('File reading is finished')); //  когда чтение файла закончено выводим надпись

//* Класс Transform
// Платный аккаунт видит IP-адреса, а бесплатный не видит IP-адреса
const payedAccount = false;
const readStream2 = fs.createReadStream(ACCESS_LOG);
const tStream = new Transform({ // трансформация потока
    transform(chunk, encoding, callback) {
        if (!payedAccount) {
            const transformed = chunk.toString().replace(/\d+\.\d+\.\d+\.\d+/g, '[HIDDEN IP]');
            this.push(transformed);
        } else this.push(chunk);

        callback();
    }
});

readStream2.pipe(tStream).pipe(process.stdout);