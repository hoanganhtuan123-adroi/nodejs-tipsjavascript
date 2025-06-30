require("dotenv").config();
const app = require("./src/app");
const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("SIGINT", () => {
  server.close(()=>{console.log("Server closed")});
});
