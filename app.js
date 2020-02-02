const express			= require("express"),
	  app				= express(),
	  methodOverride	= require("method-override"),
	  expressSanitizer	= require("express-sanitizer"),
	  mongoose 			= require("mongoose"),
	  bodyParser		= require("body-parser");

//APP CONFIG
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

mongoose.connect("mongodb+srv://aash:aash2906%23@cluster0-kmqxp.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser :true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(()=>{
	console.log("connected to db");
}).catch(err =>{
	console.log("error",err.message);
});

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title 	: String,
	image	: String,
	body 	: String,
	created : {type : Date , default: Date.now}
});

var  Blog =  mongoose.model("Blog",blogSchema);
// Blog.create(
// 	{
// 		title:"Blog 1" , 
// 		image:"https://live.staticflickr.com/1496/26708751515_5d2151daa6.jpg",
// 		body: "This is a new test blog",
// 	}, 
// 	function(err,testblog){
// 		if(err)
// 			console.log(err);
//  		else{
// 			console.log("NEWLY CREATED BLOG !!")
// 			console.log(testblog);	
// 		}
// });

//RESTFUL ROUTES
app.get("/", function(req,res){
	res.redirect("/blogs");
});
	
//INDEX ROUTE
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blog){
		if(err) 
			console.log(err);
		else{
			res.render("index",{blogs:blog})
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog ,function(err,newBlog){
		if(err)
			res.render("new");
		else{
			res.redirect("/blogs");
		}
	});
});
	
//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, UpdatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/");
		}
	
	});
});


app.listen(process.env.PORT || 3000 , process.env.IP , function(){
	console.log("server has started");
});