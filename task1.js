// Напишите программу для вывода в консоль простых чисел, чтобы они попадали в указанный
// диапазон включительно. При этом числа должны окрашиваться в цвета по принципу светофора:
// ● первое число выводится зелёным цветом;
// ● второе — жёлтым;
// ● третье — красным.
// Диапазон, куда попадут числа, указывается при запуске программы.
// Если простых чисел в диапазоне нет, нужно, чтобы программа сообщила об этом в терминале красным цветом.
// Если аргумент, переданный при запуске, не считается числом — сообщите об этом ошибкой и завершите программу.

import colors from 'colors';

const [start, end] = process.argv.splice(2);
let i = Number(start);
let n = Number(end);

if (isNaN(i) || isNaN(n)) {
    console.log(colors.red('Некорректные числа'));
} else {
    let numbers = getSimpleNumbers(i, n);
    printNumbers(numbers);
}

function getSimpleNumbers(i, n) {
    let numbers = [];

    for (i; i <= n; i++) {
        let flag = 1;
    
        if (i > 2 && i % 2 != 0) {
            for (let j = 3; j * j <= i ; j = j + 2) {
                if (i % j == 0) {
                    flag = 0;
                }
            }
        } else if (i != 2) {
            flag = 0;
        }
    
        if (flag == 1) {
            numbers.push(i);
        }
    }

    return numbers;
}

function printNumbers(numbers) {
    if (numbers.length == 0) {
        console.log(colors.red('Простых чисел в диапазоне нет'));
    } else {
        for (i = 0; i < numbers.length; i++) {
            if (i % 3 == 0) {
                console.log(colors.green(numbers[i]));
            } else if (i % 3 == 1) {
                console.log(colors.yellow(numbers[i]));
            } else {
                console.log(colors.red(numbers[i]));
            }
        }
    }
}