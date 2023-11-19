require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
const Inventory = require('./models/inventory');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// 数据库连接
mongoose.connect('mongodb+srv://Project:Aa123456@cluster0.wfnlwpv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error('Could not connect to the database. Exiting now...', err);
  process.exit();
});

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/inventory', inventoryRoutes);

// 设置 EJS 为视图引擎
app.set('view engine', 'ejs');

// 库存列表路由
router.get('/inventory', async (req, res) => {
  try {
    const inventoryItems = await Inventory.find(); // 查询数据库中的所有库存项
    res.render('inventory', { inventoryItems: inventoryItems });
  } catch (err) {
    res.status(500).send("Error occurred while fetching inventory items.");
  }
});

// 添加库存项的页面
app.get('/inventory/add', (req, res) => {
  res.render('add');
});

// 处理添加库存项的表单提交
app.post('/inventory/add', (req, res) => {
  // 在这里处理表单数据
  // 如将新的库存项添加到数据库
  // 例: Inventory.create(req.body)...

  // 添加成功后重定向到库存列表页面
  res.redirect('/inventory');
});

// 错误处理
app.use((req, res, next) => {
  res.status(404).send("Sorry, that page does not exist!");
});

// 定义一个简单的路由
app.get('/', (req, res) => {
  res.send('Inventory Management System Home Page');
});

module.exports = router;

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

