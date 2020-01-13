const displayMessage = (message) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (message === 'Wassup?') {
                return reject('Something went wrong');
            }
            return resolve(message);
        }, 3000)
    });
}

// CALLBACK HELL

// displayMessage('Hello').then(result => {
//     console.log('result', result);
//     displayMessage('There?').then((result) => {
//         console.log('result', result);
//         displayMessage('Wassup?').then((result) => {
//             console.log('result', result);
//         }).catch(error => {
//             console.log('Error', error);
//         });
//     }).catch(error => {
//         console.log('Error', error);
//     });
// }).catch(error => {
//     console.log('Error', error);
// });

// console.log('===');

// if you run node asyncAwait.js then the === will happen first because displayMessage is async and set at a 3 second timeout, then each item will run 3 seconds after the other


// ASYNC AWAIT
// works for async functions AND functions that return promises
// returns promise even though it doesn't look like it on async funcs
// in myFunc 'there' won't run until 'hello' is resolved or rejected
// 'wassup' won't run until 'there' is resolved or rejected, and so on

const greetings = async () => {
    return 'Hey';
}

greetings().then(result => console.log('***', result));


const myFunc = async () => {
    try {
        let result = '';
        result = await displayMessage('Hello');
        console.log(result);
        result = await displayMessage('There?');
        console.log(result);
        result = await displayMessage('Wassup?');
        console.log(result);
        // rejects wassup so greetings() and console won't run
        result = await greetings();
        console.log(result);
    } catch (error) {
        console.log('Error', error);
    }
}
myFunc();