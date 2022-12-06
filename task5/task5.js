import http from 'http';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { Transform } from 'stream';

const host = 'localhost';
const port = 3000;

const directory = process.cwd();

const findFilesInDir = (arr, dirName) => {
    if (dirName[dirName.length - 1] === '/') {
        dirName = dirName.substring(0, dirName.length - 1);
    }
    let li = '';
    for (const item of arr) {
        li += `<li><a href="${dirName}\\${item}">${item}</a></li>`;
    }
    return li;
};

const server = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const route = request.url.split('?')[0];
        const allPath = path.join(directory, route);
        fs.stat(allPath, (err,stats) => {
            if (!err) {
                if (stats.isFile(allPath)) {
                    const readStream = fs.createReadStream(allPath, 'utf-8');
                    readStream.pipe(response);
                } else {
                    fsp
                        .readdir(allPath)
                        .then((files) => {
                            if (route !== '/') {
                                files.unshift('..');
                            }
                            return files;
                        })
                        .then((data) => {
                            const filePath = path.join(directory, './index.html');
                            const readStream = fs.createReadStream(filePath, 'utf-8');
                            const transformStream = new Transform({
                                transform(chunk, encoding, callback) {
                                    const li = findFilesInDir(data, directory);
                                    console.log(li)
                                    this.push(chunk.toString().replace('#filelinks#', li));
                                    callback();
                                }
                            });
                            readStream.pipe(transformStream).pipe(response);
                        });
                }
            } else {
                response.end('Такого файла или пути к файлу не существует');
            }
        });
    } else {
        response.statusCode = 405;
        response.end('Method not allowed');
    }
});

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));