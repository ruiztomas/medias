import express from 'express';
import { ObjectId } from 'mongodb';
import db from '../db.js';

const router=express.Router();
const collection=db.collection('ventas');

router.get('/', async (req, res)=>{
    const items=await collection.find().toArray();
    res.json(items);
});

router.post('/', async (req, res)=>{
    const nueva={...req.body, fecha: new Date().toISOString()};
    const result= await collection.insertOne(nueva);
    res.status(201).json(result);
});

router.delete('/:id', async(req, res)=>{
    const {id}=req.params;
    await collection.deleteOne({_id: new ObjectId(id)});
    res.sendStatus(204);
});

export default router;