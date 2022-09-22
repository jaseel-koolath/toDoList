const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// var items = [];
// var work_list = [];

mongoose.connect("mongodb+srv://jaseel:chucklorre@cluster0.i9qjx8p.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemSchema = {
    name: String,
};
const listSchema = {
    name: String,
    items: [itemSchema]
}
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({name: "Welcome !"});
const item2 = new Item({name: "Hit + to add one item"});
const item3 = new Item({name: "<-- Tick this to delete"});

const defaultItems = [item1, item2, item3];
let day = "Today";

app.get("/", function(req, res) {
    Item.find({}, (erro, found_item) =>{
        if(found_item.length === 0) {
            Item.insertMany(defaultItems, err => {
                (err) ? console.log(err): console.log("Successfully added items");
            });
            res.redirect("/");
        } else 
            res.render("list", {listTitle: day, newItem: found_item});
    });
    
});
app.post("/", function(req, res) {
    const item = req.body.newItem;
    const listName = req.body.list;
    const item4 = new Item({name: item});
    if (listName === day) {
        item4.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item4);
            foundList.save();
            res.redirect("/" + listName);
        });  
    }
    
});
app.post("/delete", function(req, res){
    const delete_id = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day)  {
        Item.findByIdAndDelete( delete_id, (err) => {
            err ? console.log(err) : console.log(" delete Success!");
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName}, {$pull : {items: {_id: delete_id}}}, (err, foundList) => {
            if (!err) res.redirect("/" + listName);
        })
    }
    
});

app.get("/:list_name", function(req, res) {
    const _id = _.capitalize(req.params.list_name);
    List.findOne({name: _id}, (err, foundList) => {
        if (!err){
            if (!foundList){
                const list = new List({
                    name: _id,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+_id);
            } else 
                res.render("list", {listTitle: _id, newItem: foundList.items });
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("The server is listening on port 3000");
});

