const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(
      '<!DOCTYPE html><html lang="en"><head><title>Document</title></head><body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body></html>'
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split("=")[1];
      fs.writeFile("test.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write(
    '<!DOCTYPE html><html lang="en"><head><title>Document</title></head><body><h1>Hallo Welt</h1></body></html>'
  );
  res.end();
};

/* exports = {
  handler: requestHandler,
  text: "Some hard coded text",
}; */

// Shorthand

module.exports = {
  handler: requestHandler,
  text: "Some hard coded text and more",
};
