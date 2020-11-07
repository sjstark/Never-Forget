const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors')

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db/models");
const sequelize = db.sequelize;

const { sessionSecret } = require("./config");
const { restoreUser } = require("./auth");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const taskRouter = require("./routes/tasks");
const listsRouter = require("./routes/lists");
const appRouter = require("./routes/app-router");

const app = express();

// view engine setup
app.set("view engine", "pug");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({origin: 'http://localhost:8080'}))

const store = new SequelizeStore({
  db: sequelize,
});

let sessionLengthHours = 1;

app.use(
  session({
    name: "never-forget.sid",
    secret: sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
    maxAge: sessionLengthHours * 60 * 60 * 1000
  })
);
store.sync();

app.use(restoreUser)
app.use('/', indexRouter);
app.use('/app', appRouter);
app.use('/tasks',taskRouter);
app.use('/users', usersRouter);
app.use("/lists", listsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {


  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if(err.status === 404){
    res.render('404-page')
   return;
  }
  // set locals, only providing error in development
  res.locals.messages = err;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { err });
});

module.exports = app;
