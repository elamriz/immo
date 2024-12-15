import express from 'express';
import cors from 'cors';
import propertyRoutes from './routes/propertyRoutes';
// ... autres imports

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);
// ... autres routes

export default app; 