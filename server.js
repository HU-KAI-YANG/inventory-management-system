require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const InventoryItem = require('./models/InventoryItem');

const app = express();

// 静态文件服务
app.use(express.static('public'));

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

// 中间件：登录拦截
const requireLogin = (req, res, next) => {
  // 检查用户是否已登录
  console.log(req.session)
  if (req.session && req.session.userId) {
      return next(); // 用户已登录，继续执行下一个中间件或路由处理
  } else {
      return res.redirect('/'); // 用户未登录，返回未授权错误
  }
};

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'Aa123456',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://Project:Aa123456@cluster0.wfnlwpv.mongodb.net/' })
}));

// 设置 EJS 为视图引擎
app.set('view engine', 'ejs');

app.all('/api/*', requireLogin);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// 显示登录表单
app.get('/login', (req, res) => {
  res.render('login');
});

// 注册路由
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 登录路由
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user)
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).send('Invalid credentials');
    }
    req.session.userId = user.username;
    res.redirect('/home');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 登出路由
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


// 定义一个简单的路由
app.get('/home', requireLogin, (req, res) => {
  res.render('home', {
    pageTitle: 'Inventory Management System',
    message: 'Welcome to our system!',
    userId: req.session.userId,
    navigation: [
      { text: 'Home', link: '/home' },
      { text: 'Inventory', link: '/inventory' },
      { text: 'Logout', link: '/logout' },
    ],
  });
});

// 库存列表路由
app.get('/inventory', requireLogin, async (req, res) => {
  try {
    let param = {}
    if(req.query.gt) {
      param["quantity"] = {$gte: req.query.gt}
    }
    if(req.query.name) {
      param["name"] = req.query.name
    }
    const inventoryItems = await InventoryItem.find(param); // 查询数据库中的所有库存项
    res.render('inventory', { inventoryItems: inventoryItems , query: {name: req.query.name, gt: req.query.gt}});
  } catch (err) {
    res.status(500).send("Error occurred while fetching inventory items.");
  }
});

// 添加库存项的页面
app.get('/inventory/add', requireLogin, (req, res) => {
  res.render('add');
});

app.post('/api/inventory', async (req, res) => {
  try {
    // 创建一个新的库存项
    const newItem = new InventoryItem({
      name: req.body.name,
      quantity: req.body.quantity
    });

    // 保存到数据库
    await newItem.save();
    // 添加成功后重定向到库存列表页面
    res.redirect('/inventory');
  } catch (error) {
    // 错误处理
    res.status(500).send("Error occurred while adding the item.");
  }
});

// 获取所有库存项
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 更新库存项
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findOneAndUpdate({name: String(req.params.id)}, req.body, { useFindAndModify: false });
    console.log(updatedItem)
    if (!updatedItem) {
      return res.status(404).send();
    }
    res.send(updatedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 删除库存项
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findOneAndDelete({name: String(req.params.id)});
    if (!deletedItem) {
      return res.status(404).send();
    }
    res.send(deletedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(404).send("Sorry, that page does not exist!");
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

