import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('testdb');
    const collection = db.collection('testcollection');
    const count = await collection.countDocuments();

    return new Response(JSON.stringify({ message: 'Connected to MongoDB successfully!', documentCount: count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to connect to MongoDB', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
