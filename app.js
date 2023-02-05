const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('fruits');
    // Find some documents
    collection.find({}).toArray(function(err, fruits) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(fruits)
        callback(fruits);
    });
}

async function run() {
  let database;
  try {
    await client.connect();
    console.log("Connected Successfully to server");

    database = client.db("fruitsDB");
    const fruitsCollection = database.collection("fruits");

    const insertResult = await fruitsCollection.insertMany(
      [
        {
          name: "Apple",
          score: 8,
          review: "Great fruit",
        },
        {
          name: "Orange",
          score: 6,
          review: "Kinda sour",
        },
        {
          name: "Banana",
          score: 9,
          review: "Great stuff!",
        },
      ],
      function (err, res) {
        assert.equal(err, null);
        assert.equal(3, res.insertedCount);
        assert.equal(3, res.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(res);
      }
    );

    const cursor = fruitsCollection.find({});

    if ((await fruitsCollection.countDocuments()) === 0) {
      console.log("No documents found!");
    }

    await cursor.forEach((fruit) => {
      console.log(fruit);
    });
    
  } finally {
    findDocuments(database, function() {
        client.close();
    });
  }
}

run().catch(console.dir);
