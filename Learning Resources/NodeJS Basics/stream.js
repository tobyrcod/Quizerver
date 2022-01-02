// Examples from: https://www.youtube.com/watch?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&v=OIBIXYLJjsI
const fs = require('fs');

//Like StreamReader in C#!
const readStream = fs.createReadStream(`/Users/trco/Documents/GitHub/Quizerver/Learning Resources/NodeJS Basics/docs/big_doc.txt`, {encoding: 'utf8'});
 
// event called everytime we get a new buffer/chunk 
// of data from the stream 
readStream.on('data', (chunk) => {
  console.log("---NEW CHUNK---");
  console.log(chunk);
})