"use strict";

const express = require('express');
const app = express();
const helpers = require('express-helpers')(app);
const bodyParser = require("body-parser");
const methodOverride = require('express-method-override')

// default port 8080
const PORT = process.env.PORT || 8080;


app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//
app.get('/', function(req, res) {

});

//
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//gets information from /urls page, renders page and declares linked variables
app.get("/urls", (req, res) => {
  res.render("urls_index", {
    urls: urlDatabase
  });
});

//renders a new page where form exists
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//post takes the Method POST from the ejs file and then reads the form action to determine which app.post to use
app.post("/urls", (req, res) => {
  let shortenedURL = generateRandomString();
  // debug statement to see POST parameters
  console.log(req.body);
  urlDatabase[shortenedURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortenedURL}`);
});

//
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
})

//
app.put("/urls/:id", (req, res) => {
  let changes = req.body.changedURL;

  if (urlDatabase.hasOwnProperty(req.params.id)) {
    urlDatabase[req.params.id] = changes;
    res.redirect("/urls");
  };
})

//:id is essentially whatever the user decides to put behind /urls/
//req.params.id means whatever is in the request url. parameters of these requests and id refers to whatever behind the :
//req.query would be such as /urls?:whatever
//then renders the parameters from the ID and displays it in urls_show as shortURL in urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);

});

//
app.get("/:shortURL", (req, res) => {
  let fullURL = urlDatabase[req.params.shortURL];

  console.log(urlDatabase);
  if (fullURL === undefined) {
    // res.redirect("/urls/go back page");
    console.log("error");
  } else {
  res.status(301).redirect(fullURL);
  }
});

//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//
function generateRandomString() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


// <!-- <%= link_to(shortenLink,'/urls/new') %> -->