// const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
// console.log(res);

// primitive data types: stack memory - user gets copy
// Non primitive data types: heap memory - user gets reference

let user = {
  email: "rk@rk.com",
  upi: "rk@upi",
};

let user2 = {
  email: "pk@pk.com",
  upi: "pk@upi",
};

let user3 = user2;

user3.email = "rohit@google.com";

// console.log(user2.email);
// console.log(user3.email);

// string interpolation
const marvel_hero = ["ironman", "hulk", "thor", "spiderman"];
const dc_hero = [
  "batman",
  "superman",
  "wonderwoman",
  "aquaman",
  ["harry", "ron", "hermione"],
];

const both_hero = [...marvel_hero, ...dc_hero];
const second_hero = marvel_hero.concat(dc_hero);

// console.log(both_hero);
// console.log(second_hero);

// singleton object - through object.create method
// object literal
const user4 = {
  name: "rohit",
  email: "rk@rk",
  up: "rk@upi",
};

// console.log(user[name]);
// console.log(user["name"]);
// console.log(user.up);
// console.log(user["up"]);

const arr1 = [1, 2, 3, 4, 5];

const response = arr1.slice(0, 2);
// console.log(res);
const res3 = arr1.slice(-4, 4);
// console.log(res3);

const res4 = arr1.slice(2, -2);
// console.log(res4);
// console.log(arr1)

const res2 = arr1.splice(0, 2);
// console.log(res2);

// console.log(arr1);

const arr2 = [1, 2, 3, 4, 5];
const arr3 = arr2.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);
// console.log(arr3); // Output: 15

/* backend me post request- 


hashing function from crypto library

JWT token
access token - after successful login




*/

/* 
create arrow function not functional component
css styling of differnet pages should look appealing
add to cart button in popular products


*/

/*
footer-how is map and contact us coming
slider -button and button should lead to ?
popular products- add to cart functionality
shop from navbar - add to cart functionality, lead to pdp page


*/

/*
loader component in each api call
page refresh should not lead to loss of cart items
why react component should be wrapped in a single parent element?
search functionality in header- consider all products page

*/

/*
Not all side effects required to be in useEffect
useEffect is for side effects that need to run after render, like fetching data or subscribing to events.

localstorage : stores data even if browser is reloaded or closed, but not shared across devices or browsers.
sessionStorage: stores data for the duration of the page session, cleared when the tab or browser is closed.
*/

/* 
search
wishlist
filtering brand
product data- probably images from net

*/
// 10th June 2025
// after registration successful, redirect to login page
// data is coming pre filled in login page just after user registration
// state is remaining in cart and wishlist even after doing logout and after relaoding the state is going away
// on clicking login the header component should not render

const newUser = {
  name: "Rohit",
  greet: function () {
    setTimeout(function () {
      // console.log(`Hello, ${this.name}!`);
    }, 1000);
  },
};

// console.log(newUser.greet()); // undefined, because 'this' refers to the global object in setTimeout
// newUser.greet(); // Hello, undefined! (because 'this' is not bound to newUser in setTimeout)


// function sum(a=5, b=10) {
//      return a + b;      
//     console.log(a, b);
   
// }
// sum()

// console.log(sum(null, 20)); 
// console.log(sum(undefined,20))

var name ="this is global";
(function() {
 
  // console.log(name); //undefined, because 'name' is not defined in this scope
  // 'name' is hoisted to the top of the function scope, but not initialized yet
   var name = "this is local";
})();

//With var, you get undefined (not the global value).
// With let/const, you get a ReferenceError.

function add(x) {
    return function(y) {
        return function(z) {
            return x + y + z;
        }   
    }
}

const temp = add(5)(10)
// console.log(temp(15));


function init() {
  let name = "Mozilla"; // let,var,const- all three give the same result here
  // name is a variable declared in the parent function scope
  function displayName() {
    // displayName() is the inner function, that forms a closure
    // console.log(name); // use variable declared in the parent function
  }
  displayName();
}
init();

/*17th June 2025

 brand, category and search filter is not adding in the url in all products page

*/

/* 18th June 2025

During loading of e commerce website, /api/user/me is being called, which ig is not required- throwing 401 but is it required? --- this is the required behavior as user should be authenticated in the header itself whether he is logged in or not and then on that basis the user avatar or logout button should be rendered
search functionality at the header level- not working and also check the url appending
also after search, asus fore.g. it is coming at first and then sudden reloading and showing all products page
*/


/* 20th June 2025
   view more & view details & even footer links- smooth scroll to top on click
   
*/


//--------------------------------- coding questions for strings---------------------------------
// 1. Reverse a string without using built-in functions.
function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
// console.log(reverseString("hello")); // Output: "olleh"

function reverseString1(str) {
  return str.split('').reverse().join('');
}
// console.log(reverseString1("hello"));

function isPalindrome(str) {
  const reversed = reverseString(str);
  return str === reversed;
}
// console.log(isPalindrome("racecar")); // Output: true
// console.log(isPalindrome("hello")); // Output: false

function countVowels(str) {
  const vowels = 'aeiouAEIOU';
  let count = 0;
  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

// in popular products page, no loader at add to cart button click
// how does requestOtp in checkout is working
// on reload , cart state and wishlist state is not persisting
// if same user tries to register again, then proper error message should be shown
// functionality in accessing and order from cart page is changed, so in checkout page the request otp method is not required
// thunk or saga for api calls- middleware redux
// breadcrumbs in all products page



for (let i=0; i<=3; i++) {
  setTimeout(function() {
    // console.log(i); 
  }, 1000);
}


// Output: 4, 4, 4, 4 (due to closure, 'i' is shared across all iterations) 

// Output: 0, 1, 2, 3 (due to block scoping with 'let')
var greeting = "Hello";
(function(names) {
  // console.log(greeting + ' ' + names);
})(name);
// iife- avoids polluting global scope
// keeps logic encapsulated and private and separate
// runs as soon as it is defined

// closures

// A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope. 

// Callbacks:
// A callback is a function that is passed as an argument to another function and is executed after some operation is completed.
// Callbacks are often used for asynchronous operations, like handling events or making API requests.

// console.log(typeof null); // Output: "object"- its a bug in js forever

var person = {
  firstname: "John",
  lastname: "Doe",
  getFullName: function() {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  }
}

var logName = function(lang1, lang2) {
  // console.log("Logged: " + this.getFullName());
}
var logPersonName = logName.bind(person);
// logName()

// function borrowing
// function currying
// function currying is a technique in functional programming where a function is transformed into a sequence of functions, each taking a single argument. This allows for partial application of arguments and can lead to more flexible and reusable code.

var person3 = {
  firstname: "Default",
  lastname: "Default",
  greet: function() {
    return 'Hi ' + this.firstname;
  }
}

var john = Object.create(person3);
john.firstname = "John";
john.lastname = "Doe";
// console.log(john);


// polyfills- code that adds a feature to an older browser that natively does not support it. i.e., the feature which the engine may lack
// For example, if a browser does not support the Array.prototype.includes method, you can write
// if object.create method does not exist then using polyfills we can inject that method into the browser's prototype chain
if (!Object.create) {
  Object.create = function(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
  };
}

function KMToMiles(km) {
  if (typeof km !== 'number' || isNaN(km)) {
    throw new Error('Input must be a valid number');
  }
  return km * 0.621371;
}

const user6 = {
  frontend: {},
  rohit: {}
}

let name6 =  "rohit"

if(user6.name6){
  console.log('A')
} else {
  console.log('B');
  
}

function expensiveTask(num) {
  for(let i = 0; i < 1e9; i++) {
    // Simulating an expensive task
  }
}