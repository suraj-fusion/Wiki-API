const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
mongoose.set('strictQuery', true); //related to mongoose idk

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true }));

app.use(express.static("public"));

//connecting to wikiDB database
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });


//creating schema for articles
const articleSchema={
    title:String,
    content:String
};


//creating an model/collection based on that schema
const articles=mongoose.model("Article",articleSchema);




///////////////////////////////////Request targeting all articles////////////////////////////////////
app.route("/articles")
.get(function(req,res){

    articles.find(function(err,results){

        if(!err)
        {
           res.send(results);
        }
        else
        {
            res.send(err);
        }

    });

})

.post(function(req,res){

 
    const newArticle=new articles({
        title:req.body.title,
        content:req.body.content
    });

     newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new article.");
        }
        else{
            res.send(err);
        }
     });
})

.delete(function(req,res){


    articles.deleteMany(function(err){
        if(!err)
        {
            res.send("Successfully deleted all articles");
        }
        else
        {
            res.send(err);
        }
    });

});

////////////////////////////////////////////////////Request targeting a specific route///////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){

  
    articles.findOne({title:req.params.articleTitle},function(err,result){


        if(err)
        {
            res.send(err);
        }
        else if(result)
        {
           res.send(result);
        }
        else
        {
            res.send("No article for that title found");
        
        }

    });

})
.put(function(req,res){

    articles.replaceOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},function(err){
          
       

        if(!err)
        {
            res.send("Successfully updated article")
        }
        else
        {
            res.send("error");
        }
    });


}).patch(function(req,res){
    articles.updateOne({title:req.params.articleTitle},{$set:req.body},function(err){
    if(!err){
        res.send("Succesfully updated article");
    }
    else{
        res.send("Error");
    }
    })

}).delete(function(req,res){

    articles.deleteOne({title:req.params.articleTitle},function(err){
        if(!err)
        {
            res.send("Successfully deleted article");
        }
        else
        {
            res.send(err);
        }
    })
});


















app.listen(3000, function() {
console.log("Server started on port 3000");
});