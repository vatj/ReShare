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
  const post = await req.json();

  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const result = await collection.insertOne(post);
    return new Response(JSON.stringify(result), {
      headers: {
        "content-type": "application/json",
      },
      statusCode: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ theError: error.toString() }), {
      statusCode: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
