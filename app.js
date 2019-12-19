var express         = require("express"),
    bodyParser      = require("body-parser"),
    app             = express(),
    mongoose        = require("mongoose");

mongoose.connect("mongodb+srv://admin-m7md:Mohamed123456@cluster0-q1jky.mongodb.net/todo_list", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//List Schema
var listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
var List = mongoose.model("List", listSchema);


//WorkItems Schema
var workItemsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
var WorkItems = mongoose.model("WorkItem", workItemsSchema);


//AddedList Schema
var addedListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [listSchema]
});
var AddedList = mongoose.model("AddedList", addedListSchema);


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//This is for requiring a module that we create it by ourself. 
var date = require(__dirname + "/date.js");

//Just a simeple example.
// console.log(date);

//calling date like this will not call the function
// console.log(date);
//Now it is calling the function
// console.log(date());



app.get("/", function(req, res){
    /*
        This is a code for getting the date and display it in a particular format
        We can refactor this code and put it on its on module and reuse that code
    */
    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    // };
    // var day = new Date();
    // var dayName = day.toLocaleDateString('en-US', options);
    var dayName = date.getDate();

    List.find(function(err, lists){
        if(err){
            console.log(err);
        }
        else{
            console.log(lists);
            res.render("list", {listTitle: "", lists: lists});
        }
    });
});

app.get("/:work", function(req, res){
    var customList = req.params.work;
    customList = customList.charAt(0).toUpperCase() + customList.slice(1).toLowerCase();
    AddedList.findOne({name: customList}, function(err, result){
        if(err){
            console.log(err);
        }
        else if(result == null){
            //Create new List
            AddedList.create({
                name: customList,
                items: []
            });
            res.redirect("/" + customList);
        }
        else{
            //Show an existing list
            res.render("list", {listTitle: result.name, lists: result.items});
        }
    });
});

app.get("/about", function(req, res){
    res.render("about");
});

app.post("/delete", function(req, res){
    var obj = req.body;
    
    //Getting the property value of an object
    //console.log(obj[Object.keys(obj)[0]]); 
    //Getting the property name of an object
    //console.log(Object.keys(obj)[0]);
    

    var value = obj[Object.keys(obj)[0]];
    var property = Object.keys(obj)[0];

    List.findOneAndRemove({_id: value}, function(err, result){
        if(err){
            console.log(err);
        }
        else if(result){
            res.redirect("/");
        }
        else{
            AddedList.findOne({"items._id": value}, function(err, resul){
                if(err){
                    console.log(err);
                }
                else{
                    var items = resul.items;
                    
                    items.forEach(function(item, index){
                        if(item._id == value){
                            items.splice(index, 1);
                        }
                    });
                    resul.save();
                    res.redirect("/" + property);
                }
            });
        }
    })
});

app.post("/:work", function(req, res){
    var listName = req.params.work;
    var item = req.body.item;

    AddedList.findOneAndUpdate(
        {name: listName},
        {$push: 
            {items: 
                {name: item}
            }
        }, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/" + listName);
        }
    });
});

app.post("/", function(req, res){
    var item = req.body.item;
    List.create({
        name: item
    }, function(err, listItem){
        if(err){
            console.log(err);
        }
        else{
            console.log(listItem);
            res.redirect("/");
        }
    })
});

function addItems(){
    
    /** ---------------------------------------------------- Adding Default Item to List Collection */
    //  List.create({
    //      name: "Do Homework"
    //  }, function(err, list){
    //      if(err){
    //          console.log(err);
    //      }
    //      else{
    //          console.log("Successfully Added");
    //          console.log(list);
    //      }
    //  });


    /** ---------------------------------------------------- Adding Default Item to WorkItems Collection */
    //  WorkItems.create({
    //      name: "Sleep Early"
    //  }, function(err, workItems){
    //      if(err){
    //          console.log(err);
    //      }
    //      else{
    //          console.log("Successfully Added");
    //          console.log(workItems);
    //     }
    //  });

    var item1 = new List({
        name: "Do Homework"
    });
    var item2 = new List({
        name: "Play a little"
    });
    var item3 = new List({
        name: "Sleep Early"
    });
    return [item1, item2, item3];
}

app.listen(3000, function(){
    console.log("App Started...");
});