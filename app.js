const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var items = [];
var work_list = [];

app.get("/", function(req, res) {
    let day = date();
    res.render("list", {listTitle: day, newItem: items});
});
app.post("/", function(req, res) {
    let item = req.body.newItem;
    if (req.body.list === "Work List") {
        work_list.push(item);
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect("/");
    }
    
})

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newItem: work_list })
})

app.get("/about", function(req, res) {
    res.render("about");
})

app.listen(3000, function(){
    console.log("The server is listening on port 3000");
});