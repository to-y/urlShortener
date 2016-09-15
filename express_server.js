"use strict";

var express = require('express');
var app = express();
var helpers = require('express-helpers')(app);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
var PORT = process.env.PORT || 8080; // default port 8080


app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get('/', function(req, res) {

});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let shortenLink = "You can shorten your URL too!";

  res.render("urls_index", {
    urls: urlDatabase,
    shortenLink: shortenLink
  });
});

app.get("/urls/:id", (req, res) => {

  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send(generateRandomString());         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  let longURL =
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}