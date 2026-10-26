const { validateEnv, env } = require("../config/env");
const app = require("./app");

validateEnv();

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost${PORT}`);
});