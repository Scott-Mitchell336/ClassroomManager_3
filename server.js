const app = require("./app");
const port = 3000;

// app.listen(port, async () => {
//     console.log(`Example app listening on port ${port}`)
// })

app.listen(port, async () => {
  console.log(`Server started on http://localhost:${port}`);
  console.log("Available routes:");
  console.log("GET /api/student");
  console.log("POST /api/student");
});
