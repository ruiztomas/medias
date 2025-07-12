import express from 'express';
import { ObjectId } from 'mongodb';
import db from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const router=express.Router();
const collection=db.collection('stock');

const storage=multer.diskStorage({
    destination: (req, file, cb)=>{
        const uploadPath=path.join(__dirname, '..','uploads');
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix=Date.now()+ '-' + Math.round(Math.random()*1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload=multer({storage});

router.get('/', async(req, res)=>{
    try{
        const items=await collection.find().toArray();
        res.json(items);
    }catch(error){
        console.error('Error al obtener stock:', error);
        res.status(500).json({error: 'Error del servidor'});
    }
});

router.post('/', upload.single('imagen'), async (req, res)=>{
    try{
        const {modelo, nombre, cantidad, precioUnitario}=req.body;
        const imagenPath=req.file ? `/uploads/${req.file.filename}` : null;

        if (!modelo || !nombre || !cantidad || !precioUnitario){
            return res.status(400).json({error: 'Faltan datos'});
        }

        const nuevaMedia={
            modelo,
            nombre,
            cantidad: parseInt(cantidad),
            precioUnitario: parseFloat(precioUnitario),
            imagen: imagenPath,
            repuesta: false,
            fecha: new Date().toISOString()
        };

        const result=await collection.insertOne(nuevaMedia);
        res.status(201).json(result);
    }catch (error){
        console.error('Error al agregar media:', error);
        res.status(500).json({error: 'Error del servidor'});
    }
});

router.delete('/:id', async(req, res)=>{
    try{
        const {id}=req.params;
        await collection.deleteOne({_id: new ObjectId(id)});
        res.sendStatus(204);
    } catch(error){
        console.error('Error al eliminar media:', error);
        res.status(500).json({error: 'Error del servidor'});
    }
});

router.patch('/:id/restar', async(req, res)=>{
    try{
        const {id}=req.params;
        const {cantidad}=req.body;

        const result=await collection.updateOne(
            {_id: new ObjectId(id)},
            {$inc: {cantidad: -cantidad}}
        );
        res.json(result);
    }catch(error){
        console.error('Error al restar cantidad:',error);
        res.status(500).json({error: 'Error del servidor'});
    }
});

router.patch('/:id/repuesta', async(req, res)=>{
    const {id}=req.params;
    const {repuesta}=req.body;

    const result=await collection.updateOne(
        {_id: new ObjectId(id)},
        {$set: {repuesta: repuesta}}
    );
    res.json(result);
});

router.patch('/:id/sumar',async(req, res)=>{
    const {id}=req.params;
    const {cantidad}=req.body;

    const result=await collection.updateOne(
        {_id: new ObjectId(id)},
        {$inc: {cantidad: cantidad}}
    );
    res.json(result);
});

export default router;