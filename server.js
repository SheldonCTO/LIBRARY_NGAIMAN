const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const session = require("express-session");
app.use(
  session({
    secret: "the quick brown fox jumped over the lazy dog 1234567890", // random string, used for configuring the session
    resave: false,
    saveUninitialized: true,
  })
);

// req.body
app.use(express.urlencoded({ extended: false }));

// ejs
app.set("view engine", "ejs");

app.use(express.static("assets"));

// configure ejs
app.set("view engine", "ejs");

// receive data from a <form>
app.use(express.urlencoded({ extended: true }));

/// --------------
// DATABASE : Connecting to database and setting up your schemas/models (tables)
/// --------------

const mongoose = require("mongoose");

// 1. copy and paste your MongoDb connection string
const CONNECTION_STRING =
  "mongodb+srv://XXXXXXXXX@cluster0.fbhtgjh.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_STRING);

// 2. attempt to connect to the mongo db database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => {
  console.log("Mongo DB connected successfully.");
});

const Schema = mongoose.Schema;
const bookSchema = new Schema({
  bookTitle: String,
  bookAuthor: String,
  image: String,
  borrow: String,
});

const userSchema = new Schema({
  name: String,
  cardNo: String,
});

const books = mongoose.model("books", bookSchema);
const user = mongoose.model("users", userSchema);
module.exports = user;

app.get("/", async (req, res) => {
  // Collect bookList from DB
  const bookList = await books.find().lean().exec();
  console.log(bookList);

  // Check login user
  console.log("DEBUG: What is the session id?");
  console.log(req.session.id);
  console.log("DEBUG: What is in the session variable?");
  console.log(req.session);
  console.log("----------");

  let currUser = "";
  if (req.session.hasOwnProperty("userData") === true) {
    currUser = req.session.userData;
  } else {
    currUser = null;
  }

  // Pass both variables in a single object to res.render
  res.render("home", { bookLog: bookList, usernameFromSession: currUser });
});

app.get("/menu", (req, res) => {
  let currUser = "";
  if (req.session.hasOwnProperty("loggedInUsername") === true) {
    currUser = req.session.loggedInUsername;
  } else {
    currUser = null;
  }
  res.render("menu", { usernameFromSession: currUser });
});

app.get("/bor/:Title", async (req, res) => {
  
  let currUser = "";
  //check if user not login yet , return to login page
  //if login in, set the title and userNo for borrowing book
  //and update the DB and return new booklist and session to home
  if (req.session.hasOwnProperty("userData") === false) {
    currUser = null;
    return res.render("login", { usernameFromSession: currUser });
  } else {
    const title = req.params.Title;
    const userNo = req.session.userData.cardNo;
    if (req.session && req.session.userData && req.session.userData.cardNo) {
      const userNo = req.session.userData.cardNo;
      console.log(userNo);
      // Your code here that uses userNo
    }

    currUser = req.session.userData;
    await books.updateOne(
      { bookTitle: title },
      { $set: { borrow: userNo } },
      { upsert: false }
    );
    //booklist and user Session for return
    const bookList = await books.find().lean().exec();
    return res.render("home", {
      usernameFromSession: currUser,
      bookLog: bookList,
    });
  }
});

app.get("/ret/:Title", async (req, res) => {
  
  let currUser = "";
  if (req.session.hasOwnProperty("userData") === false) {
    currUser = null;
    return res.render("login", { usernameFromSession: currUser });
  } else {
    const title = req.params.Title;
    console.log(title);
    if (req.session && req.session.userData && req.session.userData.cardNo) {
      const userNo = req.session.userData.cardNo;
      console.log(userNo);
      // Your code here that uses userNo
    }
    currUser = req.session.userData;
    await books.updateOne(
      { bookTitle: title },
      { $set: { borrow: "" } },
      { upsert: false }
    );
    const bookList = await books.find().lean().exec();
    return res.render("home", {
      usernameFromSession: currUser,
      bookLog: bookList,
    });
  }
});

app.get("/login", (req, res) => {
  // checking if the user is logged in
  // does the req.session have a property called "loggedInUsername"

  console.log("DEBUG: What is the session id?");
  console.log(req.session.id);
  console.log("DEBUG: What is in the session variable?");
  console.log(req.session);
  console.log("----------");

  let currUser = "";
  if (req.session.hasOwnProperty("userData") === true) {
    currUser = req.session.userData;
  } else {
    currUser = null;
  }

  res.render("login", { usernameFromSession: currUser });
});

app.post("/submit", async (req, res) => {
  //user input
  const usernameFromUI = req.body.username;
  const passwordFromUI = req.body.password;
  console.log(usernameFromUI);
  console.log(passwordFromUI);
  //check user input name in DB
  const userID = await user.find().lean().exec();

  console.log(userID);

  let matchingUser = null;
  for (let currUser of userID) {
    if (
      currUser.name === usernameFromUI &&
      currUser.cardNo + currUser.name[0] === passwordFromUI
    ) {
      matchingUser = currUser;
      break;
    }
  }

  if (matchingUser === null) {
    console.log("not found");
    return res.send(
      "ERROR: Invalid credentials entered, or no matching user found"
    );
  } else {
    console.log("found");
    req.session.userData = {
      name: matchingUser.name,
      cardNo: matchingUser.cardNo,
    };
    console.log(req.session.userData);
    return res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  // .destory() is a built in function that will automatically reset
  // the session to its default value (it deletes any custom properites you added)
  // for example, the loggedInUsername property
  console.log("Logging user out!");
  req.session.destroy();

  // optional: redirect them back to the home page
  return res.redirect("/");
});

const onServerStart = () => {
  console.log("Express http server listening on: " + HTTP_PORT);
  console.log(`http://localhost:${HTTP_PORT}`);
};
app.listen(HTTP_PORT, onServerStart);
