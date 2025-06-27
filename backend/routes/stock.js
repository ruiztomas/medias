import express from 'express';
import { ObjectId } from 'mongodb';
import db from '../db.js';

const router=express.Router();
const collection=db.collection('stock');

router.get('/', async(req, res)=>{
    const items=await collection.find().toArray();
    res.json(items);
});

router.post('/', async (req, res)=>{
    const nueva=req.body;
    const result=await collection.insertOne(nueva);
    res.status(201).json(result);
});
router.delete('/:id', async(req, res)=>{
    const {id}=req.params;
    await collection.deleteOne({_id: new ObjectId(id)});
    res.sendStatus(204);
});

router.patch('/:id/restar', async(req, res)=>{
    const {id}=req.params;
    const {cantidad}=req.body;

    const result=await collection.updateOne(
        {_id: new ObjectId(id)},
        {$inc: {cantidad: -cantidad}}
    );
    res.json(result);
});

export default router;