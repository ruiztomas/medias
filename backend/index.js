import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stockRoutes from './routes/stock.js';
import ventasRoutes from './routes/ventas.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/stock', stockRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT=process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send('API de Medias Funcionando');
})

app.listen(PORT, ()=>{
    console.log(`APP inicada en puerto ${PORT}`);
});