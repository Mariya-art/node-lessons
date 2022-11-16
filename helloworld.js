// const username = 'Ivan'
// console.log('Hello, ' + username)

// const args = process.argv.splice(2) // получаем аргументы, которые передаем в консоль: node helloworld.js Ivan Ira
// console.log(`Hello, ${args[0]} and ${args[1]}`)

const [user1, user2] = process.argv.splice(2) // деструктурирующее присваивание
console.log(`Hello, ${user1} and ${user2}`)