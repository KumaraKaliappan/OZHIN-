const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
router.get('/products', async (req,res)=>{ const p = await Product.find().limit(100).lean(); res.json(p); });
router.get('/products/:slug', async (req,res)=>{ const p = await Product.findOne({slug:req.params.slug}).lean(); if(!p) return res.status(404).json({error:'Not found'}); res.json(p); });
router.post('/order', (req,res)=>{ res.json({ok:true, message:'Order received (mock)'}); });
module.exports = router;
