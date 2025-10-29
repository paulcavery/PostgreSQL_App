import express from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoroutes.js';
import db from './db.js';
import authMiddleware from './middleware/authMiddleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToFile = path.join(__dirname, 'public', 'index.html');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); 

app.get('/', (req, res) => {
  res.sendFile(pathToFile);
});

/* Imported Routers */
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
