const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// const arr3 = [arr1, arr2];
// arr3 = [[1, 2, 3], [4, 5, 6]];

// const arr3 = [...arr1, ...arr2];
// arr3.push(6);
// arr3 = [1, 2, 3, 4, 5, 6]

// creates a reference so if you update arr3, arr1 updates too
// const arr3 = arr1;
// arr3.push(6);
// arr3 and arr1 are both = [1, 2, 3, 4, 6]

// makes a copy of arr1 to arr3 so no ref
// const arr3 = arr1.slice();
// arr3.push(6);
// arr3 = [1, 2, 3, 6], arr1 = [1, 2, 3]

// SPREAD OPERATOR creates a copy, not a ref
const arr3 = [...arr1];
arr3.push(6);
// arr3 = [1, 2, 3, 6], arr1 = [1, 2, 3]

console.log('arr1', arr1);
console.log('arr3', arr3);

const userOne = {
    name: 'David',
    age: 22,
    city: 'Salt Lake City',
    country: 'USA'
}

// creates a reference so if you update userTwo's name, userOne also changes
// const userTwo = userOne;
// userTwo.name = 'John';

// usertwo will change names, but userone stays as david
// const userTwo = {};
// Object.assign(userTwo, userOne);
// userTwo.name = 'John';

// SPREAD OPERATOR, overrides name and adds a new prop gender
const userTwo = { ...userOne, name: 'John', gender: 'male' }

console.log('userOne', userOne);
console.log('userTwo', userTwo);