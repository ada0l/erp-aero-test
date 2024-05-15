const express = require("express");
const bodyParser = require("body-parser");

const routes = require("./routes");
const middlewares = require("./middlewares");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/signin", routes.signInRouter);
app.use("/signup", routes.signUpRouter);
app.use("/logout", routes.logOutRouter);
app.use("/info", routes.infoRouter);
app.use("/file", routes.fileRouter);

app.use(middlewares.errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
