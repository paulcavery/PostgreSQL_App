import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

router.post('/register', (req, res) => {
   const { username, password } = req.body; 
   /* hashing and salting the password */
   const hashedPassword = bcrypt.hashSync(password, 8);
   try{
      const stmt = db.prepare('INSERT INTO user (username, password) VALUES (?, ?)');
      const info = stmt.run(username, hashedPassword);

      /* Adding a todo default for new user */
      const defaultTodo ='Welcome to your todo list!';
      const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
      insertTodo.run(info.lastInsertRowid, defaultTodo);

      /* Create Token */
      const token = jwt.sign({ id: info.lastInsertRowid }, process.env.JWT_SECRET, {expiresIn: '24h'});
      res.json({ token });

   }catch(err){
      return res.status(500).json({ error: 'Username already exists' });
   }
   console.log(hashedPassword);
   
});

router.post('/login', (req, res) => {
   const { username, password } = req.body; 
   try{
      const getUser = db.prepare('SELECT * FROM user WHERE username = ?');
      const user = getUser.get(username);
      /* managing user not found */
      if(!user){
         return  res.status(404).json({ error: 'User not found' });
      }
   
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      /* managing password not matching */
      if(!passwordIsValid){
         return res.status(401).json({ error: 'Invalid password' });
      }

      /* Create Token */
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '24h'});
      res.json({ token });

   }catch(err){
      return res.status(500).json({ error: 'Login failed' });
   };

 });

export default router;