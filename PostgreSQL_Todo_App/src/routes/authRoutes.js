import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {
   const { username, password } = req.body; 
   /* hashing and salting the password */
   const hashedPassword = bcrypt.hashSync(password, 8);
   try{
      const user = await prisma.user.create({
         data: {
            username,
            password: hashedPassword,
         },
      });

      /* Adding a todo default for new user */
      const defaultTodo ='Welcome to your todo list!';
      await prisma.todo.create({
         data: {
            task: defaultTodo,
            userId: user.id,
         },
      });

      /* Create Token */
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '24h'});
      res.json({ token });

   }catch(err){
      return res.status(500).json({ error: 'Username already exists' });
   }
   console.log(hashedPassword);
   
});

router.post('/login', async (req, res) => {
   const { username, password } = req.body; 
   try{
      const user = await prisma.user.findUnique({
         where: {
            username: username,
         },
      });
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