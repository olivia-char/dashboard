var express = require('express');
	bodyParser = require('body-parser');
	path = require('path');
	mongoose = require('mongoose');

var app = express();
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/message_board');

app.set("views",__dirname + "/views");
app.set("view engine", "ejs"); 

app.use(bodyParser.urlencoded({extended: true}));


var PostSchema = new Schema({
	name: String,
	post: String,
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

var CommentSchema = new Schema({
	name: String,
	comment: String,
	post: {type: Schema.Types.ObjectId, ref: 'Post'}
});

mongoose.model('Post', PostSchema);
var Post = mongoose.model('Post');

mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');


app.get('/', function(req, res){
	console.log('start');
	Post.find({}).populate('comments').exec(function(err, posts){
		console.log(posts);
		res.render('index', {posts: posts})
	})
})
app.post('/comments/:id', function(req, res){
	// console.log(req.body);
	// console.log(req.params);
	var comment_data = {name: req.body.name, comment: req.body.comment, post: req.params.id};
	var new_comment = new Comment(comment_data);
	console.log(new_comment);
	Post.findOne({_id: req.params.id}, function(err, post){
		// console.log('this is comm3nt'+ comments+'this is new comment'+ new_comment);
		post.comments.push(new_comment);
		post.save(function(err, results){
			new_comment.save(function(err, comment_results){
				res.redirect('/');	
			})
		}) 
	})
})

app.post('/posts', function(req, res){
	var new_post = new Post(req.body);
	console.log(new_post);
	new_post.save(function(err, results){
		if (err){
			console.log('error in creating new post');
		}
		else {
			console.log('created new post');
			res.redirect('/');
		}
	})
})



app.listen('8000', function(){
	console.log("All Gooda port 8000: message_board")
})






