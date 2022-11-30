import inquirer from "inquirer";

inquirer
    .prompt({ // возвращает промис, когда мы его будем обрабатывать - он вернет объект
        name: 'fileName',
        type: 'list', // бывают: input, number, confirm, list, rawlist, expand, checkbox, password
        message: 'Choose file',
        choices: ['file_a', 'file_b', 'file_c', 'file_d'],
    })
    // .then((data) => console.log(data)); // можно так или через fileName (т.к. мы его задали выше):
    .then(({ fileName }) => console.log(fileName));