import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stockRoutes from './routes/stock';
import ventasRoutes from './routes/ventas';

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/stock', stockRoutes);
app.use('/api/ventas', ventasRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`APP inicada en puerto ${PORT}`);
});