const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middle wares
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://minionsUser:eKoBRjOn8hmmlrvw@cluster0.sa2k7xp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Hello from underWorld!");
});

client.connect((err) => {
  const minionsCollections = client
    .db("minios")
    .collection("minionsCollection");

  app.get("/minion", async (req, res) => {
    const query = {};
    const cursor = minionsCollections.find(query);
    const services = await cursor.toArray();
    res.send(services);
  });

  //post

  app.post("/addMinion", async (req, res) => {
    const body = req.body;
    const result = await minionsCollections.insertOne(body);
    res.send(result);
  });
});

// Review Delete
app.delete("/minions", async (req, res) => {
  const id = req.query.id;
  console.log(id);
  const filter = { _id: ObjectId(id) };
  const result = await minionsCollections.deleteOne(filter);
  res.send(result);
});

// Load single review
app.patch("/update/minion", async (req, res) => {
  const id = req.query.id;
  const filter = { _id: ObjectId(id) };
  const updateMinion = req.body;
  const options = { upsert: true };
  const updatedMinion = {
    $set: {
      name: "minion",
    },
  };
  console.log(updateMinion);
  console.log(id);
  const result = await minionsCollections.updateOne(
    filter,
    updatedMinion,
    options
  );
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
