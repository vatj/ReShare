import { MongoClient, ServerApiVersion } from "mongodb";

console.log("Init database connection");

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default async (req, context) => {
  try {
    console.time("start get handler");
    const database = await mongoClient.db(process.env.MONGODB_DATABASE);
    // console.time("connected to db. get collection")
    const collection = await database.collection(
      process.env.MONGODB_COLLECTION
    );
    const results = await collection.find({}).limit(10).toArray();
    console.timeEnd("start get handler");

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
