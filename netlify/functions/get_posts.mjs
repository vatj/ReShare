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
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({}).limit(10).toArray();
    return new Response(JSON.stringify(results), {
      headers: {
        "content-type": "application/json",
      },
      statusCode: 200,
    });
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  } finally {
    await mongoClient.close();
  }
};
