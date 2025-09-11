const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "DEV";

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${NODE_ENV} server running on port: ${PORT}`);
  });
}
