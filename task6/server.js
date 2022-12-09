// Дополните мессенжер следующим инструментарием:
// 1. Пользователи должны видеть не только сообщение о подключении нового клиента, но и об
// отключении клиента или переподключении.
// 2. На странице приложения важно, чтобы сообщения от разных клиентов различались. Для
// этого генерируйте ник пользователя при каждом его подключении.
// 3. Пользователи должны видеть сообщения к серверу от других пользователей.
// 4. Добавьте счётчик посетителей на странице, который работал бы через сокеты и динамически
// обновлялся на всех клиентах при их подключении или отключении.

import http from "http";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";

const host = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {

    const filePath = path.join(process.cwd(), "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);
let clients = [];

io.on('connection', (client) => {
  client.on('global room', (global) => {
    client.name = global.name;
    clients.push(client);
    console.log(`${client.name} connected`);
    client.join(global.room);
  
    client.broadcast.emit('count-msg', { count: clients.length, connectMes: 'New user connected' });
    client.emit('count-msg', { count: clients.length, connectMes: 'New user connected' });
  });

  client.on('disconnect', (client) => {
    console.log(`User disconnected`);
    clients.splice(clients.indexOf(client), 1);

    io.emit('count-msg', { count: clients.length, connectMes: 'User disconnected' });
  });

  client.on('client-msg', (data) => {
    client.name = data.name;
    console.log(`${client.name} sent message`);

    client.broadcast.emit('server-msg', { name: data.name, msg: data.msg })
    client.emit('server-msg', { name: data.name, msg: data.msg })
  });
});

server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);
