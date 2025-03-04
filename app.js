const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(3000, (err) => {
    if (err) throw err;
    console.log("Next.js is running on port 3000");
  });
});
