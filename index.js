// const colors = require('colors')
import colors from 'colors'; // для импортирования необходимо добавить в package.json директиву "type": "module"

const [user1, user2] = process.argv.splice(2) // деструктурирующее присваивание
console.log(`Hello, ${colors.green(user1)} and ${colors.red(user2)}`)