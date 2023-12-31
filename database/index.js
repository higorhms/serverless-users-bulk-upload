const { MongoClient } = require("mongodb");

let dbConnection = null;

async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  const connection = await client.connect();
  dbConnection = connection.db(process.env.MONGO_DB_NAME);
  return dbConnection;
}

async function getUserByCredentials(username, password) {
  const client = await connectToDatabase();
  const collection = await client.collection('users');

  const user = await collection.findOne({ username, password });

  return user;
}

async function saveResultsToDatabase(results) {
  const client = await connectToDatabase();
  const collection = await client.collection('results');

  const result = await collection.insertOne(results);
  return result;
}

async function saveUser(user) {
  const client = await connectToDatabase();
  const collection = await client.collection('users');
  const foundUser = await getUserByCredentials(user.username, user.password);
  if(foundUser) throw new Error(`${foundUser.username} is already registered.`)
  const result = await collection.insertOne(user);
  return result;
}

module.exports = {
  connectToDatabase,
  getUserByCredentials,
  saveResultsToDatabase,
  saveUser
}