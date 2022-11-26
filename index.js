const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// Mongo DB

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elpkqgt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const pastryCollections = client.db("pastryCloud").collection("pastries");
    const reviewCollections = client.db("pastryCloud").collection("reviews");
    const blogCollections = client.db("pastryCloud").collection("blogs");

    app.get("/pastries", async (req, res) => {
      const query = {};
      const cursor = pastryCollections.find(query);
      const pastries = await cursor.toArray();
      res.send(pastries);
    });

    app.get("/pastries/:limit", async (req, res) => {
      const limit = req.params.limit;
      const query = {};
      const cursor = pastryCollections.find(query);
      const pastries = await cursor.limit(parseInt(limit)).toArray();
      res.send(pastries);
    });

    app.get("/pastry/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const pastry = await pastryCollections.findOne(query);
      res.send(pastry);
    });

    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollections.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // reviews api
    app.get("/reviews", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = {
          reviewerEmail: email,
        };
      }
      const cursor = reviewCollections.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/reviews/:pastryId", async (req, res) => {
      const pastryId = req.params.pastryId;
      const query = { pastryId: pastryId };
      const cursor = reviewCollections.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const reviews = await reviewCollections.insertOne(review);
      res.send(reviews);
    });

    app.post("/pastries", async (req, res) => {
      const pastry = req.body;
      const pastries = await pastryCollections.insertOne(pastry);
      res.send(pastries);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const reviewId = req.params.id;
      const query = { _id: ObjectId(reviewId) };
      const result = await reviewCollections.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send(`Pastry Cloud server running on ${port}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
