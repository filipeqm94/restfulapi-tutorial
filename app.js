/***** IMPORTS *****/
import ejs from "ejs";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

/***** Variables *****/
const app = express();
const PORT = process.env.PORT || 3000;
const db = "mongodb://localhost:27017/wikiDB";

/***** SCHEMAS *****/
//---Article Schema starts---
const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);
//---Article Schema ends---

//Set view engine to ejs
app.set("view engine", "ejs");

//app.use starts
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));
//app.use ends

//DB connection
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// /article route starts
app
  .route("/articles")

  //Get
  .get((req, res) => {
    Article.find({}, (err, foundArtciles) => {
      if (!err) {
        res.send(foundArtciles);
      } else {
        res.send(err);
      }
    });
  })

  //Post
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article to the database");
      } else {
        res.send(err);
      }
    });
  })

  //Delete
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Deleted every article from Database");
      } else {
        res.send(err);
      }
    });
  });
// /articles route ends

// /articles/:articleTitle route starts
app
  .route("/articles/:articleTitle")
  //Get
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  //Update
  .put((req, res) => {
    const articleTitle = req.params.articleTitle;

    const title = req.body.title;
    const content = req.body.content;

    Article.updateOne(
      { title: articleTitle },

      {
        title,
        content,
      },

      (err) => {
        if (!err) {
          res.send("Successfully updated Article");
        } else {
          res.send(err);
        }
      }
    );
  })
  //Patch
  .patch((req, res) => {
    const articleTitle = req.params.articleTitle;

    const body = req.body;

    Article.updateOne({ title: articleTitle }, { $set: body }, (err) => {
      if (!err) {
        res.send("Successfully updated Article");
      } else {
        res.send(err);
      }
    });
  })
  //Delete
  .delete((req, res) => {
    const articleTitle = req.params.articleTitle;

    Article.deleteOne({ title: articleTitle }, (err) => {
      if (!err) {
        res.send(
          `Article entry on ${articleTitle} has been successfully deleted`
        );
      } else {
        res.send(err);
      }
    });
  });
// /articles/param route ends

//Listen
app.listen(PORT, () => {
  console.log(`Server started on Port: ${PORT}`);
});
