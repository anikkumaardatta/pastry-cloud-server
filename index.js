const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// Mongo DB

// const user = ;
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

    app.get("/pastries", async (req, res) => {
      const query = {};
      const cursor = pastryCollections.find(query);
      const pastries = await cursor.toArray();
      res.send(pastries);
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
