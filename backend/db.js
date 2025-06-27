import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client=new MongoClient(process.env.MONGO_URI);

try{
    await client.connect();
    console.log('Conectado a MongoDB Atlas');
} catch(error){
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
}

const dbName=process.env.DB_NAME || 'tienda';
const db=client.db(dbName);

export default db;