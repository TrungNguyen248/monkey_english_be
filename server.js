const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config");

const PORT = port || 8080;

app.listen(PORT, () => {
  console.log(`Server start with ${PORT}`);
});
