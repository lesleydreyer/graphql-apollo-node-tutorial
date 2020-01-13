const user = {
    name: 'David',
    age: 22,
    city: 'Salt Lake City',
    country: 'USA'
}
// const name = user.name;
// const country = user.country;

// DESTRUCTURING OBJECT
const { name, country } = user;
console.log(name, country);


const myArr = [1, 2, 3, 4];
// const foo = myArr[0];
// const bar = myArr[1];
// const baz = myArr[2];

// DESTRUCTURING ARRAY
const [foo, bar, baz] = myArr;
console.log(foo, bar, baz);