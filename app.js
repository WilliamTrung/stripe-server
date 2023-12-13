var createError = require("http-errors");
var fs = require("fs");
const options = {
  key: fs.readFileSync('./stripe-test/certificates/key.pem'),
  cert: fs.readFileSync('./stripe-test/certificates/cert.pem')
}

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const paymentRoutes = require("./routes/paymentRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");

var https = require("https");
var app = express();
const PORT = 4000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(cors());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use("/payments", paymentRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.get("/", (req, res) => {
  res.send("<h2>Hello world </h2>");
});


https.createServer(options, app).listen(5000, () => {
  console.log("API is listening on port");
});

module.exports = app;
