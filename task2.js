// Напишите программу, которая будет принимать на вход несколько аргументов: дату и время в
// формате «час-день-месяц-год». Задача программы — создавать для каждого аргумента
// таймер с обратным отсчётом: посекундный вывод в терминал состояния таймеров (сколько
// осталось). По истечении какого-либо таймера, вместо сообщения о том, сколько осталось,
// требуется показать сообщение о завершении его работы. Важно, чтобы работа программы
// основывалась на событиях.

import EventEmitter from "events";
import colors from 'colors';

const [hour, day, month, year] = process.argv.splice(2)[0].split('-');
const date = new Date(year, month - 1, day, hour);
console.log(colors.blue(`Выбранная дата: ${date}`));
const now = new Date();
console.log(colors.blue(`Текущая дата: ${now}`));
const gap = Math.floor((date - now)/1000); // разница между датами в секундах

class Timer {
    constructor(days, hours, minutes, seconds) {
        this.days = days,
        this.hours = hours,
        this.minutes = minutes,
        this.seconds = seconds
    }
};

const delay = () => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    });
};

const generateNewTimer = (gap) => {
    const seconds = gap % 60;
    const minutes = ((gap - seconds) / 60) % 60;
    const hours = ((((gap - seconds) / 60) - minutes) / 60) % 24;
    const days = (((((gap - seconds) / 60) - minutes) / 60) - hours) / 24;

    return new Timer(days, hours, minutes, seconds);
};

const timerOn = (days, hours, minutes, seconds) => {
    // console.clear(); // можно сделать таймер в одну строку
    console.log(`Осталось ${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд`);
};

const emitter = new class extends EventEmitter {};

emitter.on('error', console.log);
emitter.on('timerOn', timerOn);
emitter.on('timerOff', () => {
    emitter.emit('error', 'Таймер истёк');
});

const run = (gap) => {

    if (gap > 0) {
        const timer = generateNewTimer(gap);
        emitter.emit('timerOn', timer.days, timer.hours, timer.minutes, timer.seconds);
        delay().then(() => run(gap - 1));
    } else {
        emitter.emit('timerOff');
    }
};

//Запускаем программу:
run(gap);