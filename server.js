const app = require("./app");
const port = 3000;

process.env.JWT = "shhh";

app.listen(port, async () => {
  console.log(`App listening on port ${port}`);
});
