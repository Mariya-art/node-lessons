import EventEmitter from "events";

const requestTypes = [
    {
        type: 'send',
        payload: 'to send a document',
    },
    {
        type: 'receive',
        payload: 'to receive a document',
    },
    {
        type: 'sign',
        payload: 'to sign a document',
    },
];

class Customer {
    constructor(params) {
        this.type = params.type
        this.payload = params.payload
    }
};

const generateIntInRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};

const generateNewCustomer = () => {
    const intervalValue = generateIntInRange(1, 5) * 1000;
    const params = requestTypes[generateIntInRange(0, 2)];

    return delay(intervalValue).then(() => new Customer(params));
};

class Handler {
    static send(payload) {
        console.log('Send request');
        console.log(`Customer need ${payload}`);
    };
    static receive(payload) {
        console.log('Receive request');
        console.log(`Customer need ${payload}`);
    };
    static sign(payload) {
        console.log('Sign request');
        console.log(`Customer need ${payload}`);
    };
};

const emitter = new class extends EventEmitter {};

emitter.on('error', console.log);
emitter.on('send', Handler.send);
emitter.on('receive', Handler.receive);
//emitter.on('sign', Handler.sign);

// emitter.once('send', Handler.send); // метод .once - обработчик вызывается однократно и удаляется
// emitter.removeListener('send', Handler.send); // метод .removeListener - удаляет обработчик

// У эмиттера максимальное кол-во обработчиков 10. Если нужно увеличить:
// emitter.setMaxListeners(20);

emitter.on('sign', () => {
    emitter.emit('error', 'Сотрудник заболел');
});

// Можно запустить и проверить генерацию нового посетителя:
// generateNewCustomer().then(
//     customer => emitter.emit(customer.type, customer.payload)
// );

// Создадим функцию генерации посетителей:
const run = async () => {
    const customer = await generateNewCustomer();
    emitter.emit(customer.type, customer.payload);

    run();
};

//Запускаем программу:
run();