const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const { log } = require('console');

const app = express();
const port = 3000;


const dbFilePath = path.join(__dirname, 'db.json');


app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.join(__dirname, 'index')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index', 'index.html'));
});


const readDB = () => {
  return fs.readJson(dbFilePath);
};


const writeDB = (data) => {
  return fs.writeJson(dbFilePath, data);
};


app.post('/api/register', async (req, res) => {
  try {
    const { id, email, pass } = req.body;
    if (!id || !email || !pass) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let db = await readDB();
    if (db.users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    db.users.push({ id, email, pass});
    await writeDB(db);

    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/signin', async (req, res) => {
  try {
    const { email, pass } = req.body;
    console.log(email,pass);
    
    console.log('Sign In Request:', req.body); 

    if (!email || !pass) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let db = await readDB();
    console.log('Database Users:', db.users); 

    const user = db.users.find(user => user.email === email && user.pass === pass);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Sign in successful' });
  } catch (err) {
    console.error('Server Error:', err); 
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index', 'index.html'));
});


app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'movieDashboard', 'dashboard.html'));
});




app.listen(port, () => {
 
});

app.post('/api/watchlist/add', async (req, res) => {
  try {
    const { email, movie } = req.body;
    

    if (!email || !movie) {
      return res.status(400).json({ message: 'Email and movie data are required' });
    }

    let db = await readDB();
    const user = db.users.find(user => user.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    if (user.watchlist.find(item => item.id === movie.id)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(movie);
    await writeDB(db);

    res.status(200).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/watchlist/:email', async (req, res) => {
  try {
    const { email } = req.params;

    let db = await readDB();
    const user = db.users.find(user => user.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.watchlist || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;

    let db = await readDB();
    const user = db.users.find(user => user.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



