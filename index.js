import express from "express";
import bodyParser from "body-parser";

import mongoose from "mongoose";

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://vaibhav292002:mongo12345@blogdatabase.7d7tcfu.mongodb.net/BlogDatabase')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  const blogPostSchema = new mongoose.Schema({
    title: {
      type: String,      
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
  });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

const blog1 = new BlogPost({
  title: "The Rise of Decentralized Finance",
  content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
  author: "Alex Thompson",
  createdAt: Date.now()
});
const blog2 = new BlogPost({
  title: "The Impact of Artificial Intelligence on Modern Businesses",
  content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
  author: "Mia Williams",
  createdAt: Date.now()
});
const blog3 = new BlogPost({
  title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
  content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
  author: "Samuel Green",
  createdAt : Date.now()
});

const Defaultposts = [blog1,blog2,blog3]




//CHALLENGE 1: GET All posts
app.get("/posts", (req, res) => {
  BlogPost.find({})
    .then(posts => {
      if(posts.length==0){
        BlogPost.insertMany(Defaultposts).then(console.log("Item is added")).catch("failed to add the item")
      }
      else{
        return res.json(posts);
      }
    })
    .catch(error => {
      console.error("Error finding posts:", error);
      res.sendStatus(500).json({ error: "Unable to fetch posts from mongodb database" });
    });
});


//CHALLENGE 2: GET a specific post by id
app.get("/posts/:id",(req,res)=>{
  const id=req.params.id;
  BlogPost.findById(id)
  .then(post=>res.json(post))
  .catch((error)=>{
    console.error("Error finding posts:", error);
    res.sendStatus(404).json({ error: "Post not found" });
  });
})

//CHALLENGE 3: POST a new post
app.post("/posts",(req,res)=>{
  const blog=new BlogPost({
    title: req.body.title,
    content: req.body.content,
    author:req.body.author,
    createdAt: Date.now(),
  })
  blog.save();
  res.sendStatus(200).json(toPost);
})

//CHALLENGE 4: PATCH a post when you just want to update one parameter

app.patch("/posts/:id", (req, res) => {
  const {id}=req.params;
  const {title,content,author}=req.body;
  let updateObject = {};
    if (title){
      updateObject.title = title;
    }  
    if (content) {
      updateObject.content = content;
    }  
    if (author) {
      updateObject.author= author;
    }
    BlogPost.findByIdAndUpdate(id, updateObject, { new: true })
    .then(updatedpost=> res.json(updatedpost))
    .catch(error=>{
      console.error('Error updating blog post:', error);
      res.sendStatus(404).json({ message: 'Does not find any post with the given id' });
    })
});



//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/posts/:id",(req,res)=>{
  const {id}=req.params;
  BlogPost.findByIdAndDelete(id)
    .then(deletedPost => {
        if (deletedPost) {
          res.json({ message: "Post deleted" });
        } else {
          res.json({message:'No post found with the provided ID'});
        }
    })
    .catch(error => {
        console.error('Error deleting post:', error);
    });
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
