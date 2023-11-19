const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory'); // 引入刚才创建的Inventory模型

// 获取所有库存项
router.get('/inventory', async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.render('inventory', { inventoryItems });
  } catch (err) {
    res.status(500).send('Error retrieving inventory items.');
  }
});

// 显示添加库存项的表单
router.get('/inventory/add', (req, res) => {
  res.render('add');
});

// 处理添加库存项的表单提交
router.post('/inventory/add', async (req, res) => {
  try {
    const newItem = new Inventory({
      name: req.body.name,
      quantity: req.body.quantity
    });
    await newItem.save();
    res.redirect('/inventory');
  } catch (err) {
    res.status(500).send('Error saving the item.');
  }
});


module.exports = router;

