import { MongoClient, ServerApiVersion } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const clientPromise = mongoClient.connect();

export default async (req, context) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    console.log("database");
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    console.log("collection");
    const results = await collection.find({}).limit(10).toArray();
    console.log("results", results);
    return new Response(JSON.stringify(results), {
      headers: {
        "content-type": "application/json",
      },
      statusCode: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ theError: error.toString() }), {
      statusCode: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
