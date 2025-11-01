import express from 'express';
import prisma from '../prismaClient.js';


const router = express.Router();

/* Get all todos for a user */
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
       where: {
          userId: req.userId,
       },
    });
    res.json(todos);
});

/* Create new todo */
router.post('/', async (req, res) => {
    const {task} = req.body;
    const todo = await prisma.todo.create({
       data: {
            task,
            userId: req.userId,
         }, 
    });
    res.json(todo);
});

/* Edit todo */
router.put('/:id', async (req, res) => {
    const {task,completed} = req.body;
    const {id} = req.params;
    const updatedTodo = await prisma.todo.update({
       where: {
          id: parseInt(id),
          userId: req.userId,
       },
       data: {
            completed: !!completed,
       },
    });
    res.json(updatedTodo); 
});

/* Delete todo */
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const userId = req.userId;
    await prisma.todo.deleteMany({
       where: {
            id: parseInt(id),
            userId,
         }, 
    });
    res.json({message: 'Todo deleted'});
}); 

export default router;