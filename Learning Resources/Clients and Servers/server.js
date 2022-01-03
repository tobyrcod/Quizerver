const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

  //Set html content type for response
  res.setHeader('Content-Type', 'text/html')

  //Send the html file
  fs.readFile(`${__dirname}/client/index.html`, (err, data) => {
    if (err) {
      console.log(err);
    }
    else{
      res.write(data)
    }
  });
  
  // Send the responce back to the browser
  res.end()
});

server.listen(3000, 'localhost', () => {
  console.log('listening for requests on port 3000')
});