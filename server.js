require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
const Inventory = require('./models/inventory');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const InventoryItem = require('./models/InventoryItem');


const app = express();

app.use(express.static('public'));

mongoose.connect('mongodb+srv://Project:Aa123456@cluster0.wfnlwpv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error('Could not connect to the database. Exiting now...', err);
  process.exit();
});

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

app.set('view engine', 'ejs');

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/inventory', async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.render('inventory', { inventoryItems: inventoryItems });
  } catch (err) {
    res.status(500).send("Error occurred while fetching inventory items.");
  }
});

app.get('/inventory/add', (req, res) => {
  res.render('add');
});

app.post('/inventory/add', async (req, res) => {
  try {
    const newItem = new Inventory({
      name: req.body.name,
      quantity: req.body.quantity
    });

    await newItem.save();
    res.redirect('/inventory');
  } catch (error) {
    res.status(500).send("Error occurred while adding the item.");
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(201).send(newItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).send();
    }
    res.send(updatedItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).send();
    }
    res.send(deletedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', (req, res) => {
  res.render('home', {
    pageTitle: 'Inventory Management System',
    message: 'Welcome to our system!',
    navigation: [
      { text: 'Home', link: '/' },
      { text: 'Login', link: '/login' },
      { text: 'Register', link: '/register' },
      { text: 'View Inventory', link: '/inventory' },
      { text: 'Add Inventory Item', link: '/inventory/add' },
    ],
  });
});

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

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).send('Invalid credentials');
    }
    req.session.userId = user._id;
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(404).send("Sorry, that page does not exist!");
});

module.exports = router;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
