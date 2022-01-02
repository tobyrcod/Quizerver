// Examples from: https://www.youtube.com/watch?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&v=OIBIXYLJjsI

// What is Node.JS going to be for?
// To run the server on the back end

// What is the Global Object in Node.JS?
// global! (unlike window for JS in a browser)


//setTimeout will run the given function after a given number of milliseconds
const delay = 3000;
setTimeout(() => {
  console.log(`delay of ${delay/1000} seconds!`)
  clearInterval(interval) // Stops the interval from repeating (think sort of a subroutine in unity!)
  restOfExample()
}, delay);


//setInterval will repeat a function every given milliseconds amount of time
const tick = 1000
const interval = setInterval(() => {
  console.log(`repeated every ${tick/1000} seconds!`)
}, tick);

function restOfExample() {
  console.clear()
  console.log(__dirname) // __dirname is going to be very useful for when we start using JSON files!
  console.log(__filename)
}