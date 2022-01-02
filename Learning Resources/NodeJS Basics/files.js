// Examples from: https://www.youtube.com/watch?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&v=OIBIXYLJjsI
console.clear()

// Access to the file system is only avaliable via Node.JS (not a typical JS fucntionality)
const fs = require('fs')

// reading files
fs.readFile(`${__dirname}/docs/about_me.txt`, (err,data) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(data.toString());
  }
});

// writing files
fs.appendFile(`${__dirname}/docs/about_me.txt`, `\n${Date.now().toString()}`, (err) => {
  if (err) {
    console.log(err)
  }
});

// directories
if (!fs.existsSync('./assets')) {
  fs.mkdir('./assets', (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("directory created")
    }
  });
}
else {
  fs.rmdir('./assets', (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("directory deleted");
    }
  });
}

// deleting files
if (fs.existsSync(`${__dirname}/docs/deleteme.txt`)) {
  fs.unlink(`${__dirname}/docs/deleteme.txt`, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("delete me file has been deleted")
    }
  });
}