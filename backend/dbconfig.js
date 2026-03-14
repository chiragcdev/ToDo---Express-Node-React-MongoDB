//const { MongoClient } = require('mongodb');
import { MongoClient } from 'mongodb';

// Connection URL and Database Name
const url = "mongodb://localhost:27017";
const dbName = "todo-app";
//export const collectionName = "todo";

// Create a new MongoClient
const client = new MongoClient(url);

// Function to connect to the database and return the database object
export const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbName);
}