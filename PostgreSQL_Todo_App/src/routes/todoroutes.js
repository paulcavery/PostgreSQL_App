import express from 'express';
import db from '../db.js';


const router = express.Router();

/* Get all todos for a user */
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId);
    res.json(todos);
});

/* Create new todo */
router.post('/', (req, res) => {
    const {task} = req.body;
    const insertTodos = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
    insertTodos.run(req.userId, task);
    res.json({id: insertTodos.lastID, task, completed: 0});
});

/* Edit todo */
router.put('/:id', (req, res) => {
    const {task,completed} = req.body;
    const {id} = req.params;
    const updateTodo = db.prepare('UPDATE todos SET task = ?, completed = ? WHERE id = ?');
    updateTodo.run(task, completed, id);
    res.json({message: 'Todo updated'}); 
});

/* Delete todo */
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const userId = req.userId;
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    deleteTodo.run(id, userId);
    res.json({message: 'Todo deleted', id});
}); 

export default router;