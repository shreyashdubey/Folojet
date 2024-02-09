require("dotenv").config();
const cors = require("cors");
const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port = 443;
server.listen(port, () => {
  console.log(`Backend Server listening on ${port}`);
});
