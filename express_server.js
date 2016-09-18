"use strict";

const mongo = require('./mongo_connect.js')
const express = require('express');
const app = express();
const helpers = require('express-helpers')(app);
const bodyParser = require("body-parser");
const methodOverride = require('express-method-override')

// default port 8080
const PORT = process.env.PORT || 8080;

//
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');


//redirects to localhost:8080/urls
app.get('/', function(req, res) {
  res.redirect("/urls");
});

//gets information from /urls page
//calls all function and inputs collection name to find database
//renders page and links variables from database to to urls_index page
app.get("/urls", (req, res) => {
  mongo.all((urls) => {
    res.render("urls_index", {
      urls: urls
    })
  });
});

//renders 404 page
app.get("/urls/404", (req, res) => {
  mongo.all((urls) => {
    res.render("urls_404", {
      urls: urls
    })
  });
});

//renders a new page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//post takes the Method POST from the ejs file and then reads the form action to determine which app.post to use
//make random string into variable so all random strings are same
//insert by getting URL from user input by taking it out of req.body, and create new short url
//two parameters inserted into insert function to create object
//redirects to a new url/:id page
app.post("/urls", (req, res) => {
  let shortenedURL = generateRandomString();
  mongo.insert({shortURL: shortenedURL, longURL: req.body.longURL}, (err) => {
    if (err) return res.redirect("urls/new");
    res.redirect(`/urls/${shortenedURL}`);
  })
});

//deletes using id call from urls/:id => inputted by user on address bar
//so request parameters named id
//redirects to homepage even if error
app.delete("/urls/:id", (req, res) => {
  mongo.delete(req.params.id, (err) => {
    res.redirect("/urls");
  })
})

//put because method is called on post
//takes user input declared id to find object in mongo
//takes user input from html page (req.body) which is declared in html page as changedURL
//redirect to home page
app.put("/urls/:id", (req, res) => {
  let changes = req.body.changedURL;
  mongo.update(req.params.id, changes, (err) => {
    if (err) return (err);
    res.redirect("/urls");
  })
  });

//:id is essentially whatever the user decides to put behind /urls/
//req.params.id means whatever is in the request url. parameters of these requests and id refers to whatever behind the :
//req.query would be such as /urls?:whatever
//then renders the parameters from the ID and displays it in urls_show as shortURL in urls_show
app.get("/urls/:id", (req, res) => {
  mongo.get(req.params.id, (err, urlData) => {
    let shortURL = req.params.id;
    if (err) return (err);
    res.render("urls_show", {
      shortURL: shortURL,
      longURL: urlData.longURL
    })
  })
})

//takes short url id inputted by user into address bar and sticks it into get in mongo
//redirects to 404 if short url does not exist
//else redirect status and goes to the longURL found in urlData object from database
app.get("/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  mongo.get(short, (err, urlData) => {
    if (!urlData) {
      res.status(404).redirect("/urls/404");
    } else {
    res.status(301).redirect(urlData.longURL);
  }
  })
});

//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//generates random string of 6 length given A-Z, a-z, 0-9
function generateRandomString() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
