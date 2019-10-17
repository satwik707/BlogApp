var express = require("express"),
app = express(),
bodyparser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),

mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(methodOverride('_method'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
var blogSchema=mongoose.Schema(
    {
        title:String,
        image:String,
        body:String,
        created:{type:Date,default:Date.now}
    });
var blog=mongoose.model("blog",blogSchema);
//blog.create({
  //  title:"blog post",
//    image:"https://images.unsplash.com/photo-1551190146-2ad61e23f335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  //  body:"this is a blog post"
//});
app.get("/",function(req,resp)
{
   resp.redirect("/blogs"); 
});
app.get("/blogs",function(req,resp)
{
    blog.find({},function(error,blogs)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            resp.render("index",{blogs : blogs});
        }
        
    });
    
});
app.get("/blogs/new",function(req,resp)
{
    resp.render("new");
});
app.post("/blogs",function(req,resp)
{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(error,newBlog)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            resp.redirect("/blogs");
        }
    })
});
app.get("/blogs/:id",function(req,resp)
{
    blog.findById(req.params.id,function(error,foundblog)
    {
        if(error)
        {
            resp.redirect("/blogs");
        }
        else
        {
            resp.render("show",{blog:foundblog});
        }
    })
});
app.get("/blogs/:id/edit",function(req,resp)
{
    blog.findById(req.params.id,function(error,foundblog)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            resp.render("edit",{blog:foundblog});
        }
        
    })
});

app.put("/blogs/:id",function(req,resp)
{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(error,updatedblog)
    {
        if(error)
        {
         resp.redirect("/blogs");   
        }else
        {
            resp.redirect("/blogs/"+req.params.id);
        }
    });
});
app.delete("/blogs/:id",function(req,resp)
{
    blog.findByIdAndRemove(req.params.id,function(error)
    {
        if(error)
        {
            resp.redirect("/blogs");
        }
        else
        {
            resp.redirect("/blogs");
        }
    })
});





app.listen(process.env.PORT,process.env.IP,function()
{
   console.log("server is running"); 
});
