const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
function auth(req,res,next){
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if(!token) return res.status(401).json({error:'Unauthorized'});
  try{ const data = jwt.verify(token, process.env.JWT_SECRET || 'replace_with_secret'); req.user=data; next(); }catch(e){ return res.status(401).json({error:'Invalid token'}); }
}
router.post('/setup', async (req,res)=>{
  const key = req.body.setupKey; if(!key || key !== process.env.ADMIN_SETUP_KEY) return res.status(401).json({ error: 'Invalid setup key' });
  const { name, email, password } = req.body; if(!email||!password) return res.status(400).json({error:'Missing'});
  const existing = await User.findOne({ email }); if(existing) return res.status(400).json({ error:'Admin exists' });
  const hash = await bcrypt.hash(password, 10); const u = new User({ name, email, passwordHash:hash, role:'admin' }); await u.save(); res.json({ok:true, message:'Admin created'});
});
router.post('/auth/login', async (req,res)=>{ const {email,password}=req.body; if(!email||!password) return res.status(400).json({error:'Missing'}); const u = await User.findOne({email}); if(!u) return res.status(401).json({error:'Invalid'}); const match = await bcrypt.compare(password,u.passwordHash); if(!match) return res.status(401).json({error:'Invalid'}); const token = jwt.sign({id:u._id,email:u.email,role:u.role}, process.env.JWT_SECRET||'replace_with_secret',{expiresIn:'7d'}); res.json({token}); });
router.get('/products', auth, async (req,res)=>{ const p = await Product.find().lean(); res.json(p); });
router.post('/products', auth, async (req,res)=>{ const p = new Product(req.body); await p.save(); res.json(p); });
router.put('/products/:id', auth, async (req,res)=>{ const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true }).lean(); res.json(p); });
module.exports = router;
