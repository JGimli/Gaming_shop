const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


const corsOptions={
    origin:["http://localhost:5173"]
}

const games =require('./games');
const users =require('./users');
const registration = require('./register');

app.use(express.json());
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    games.getAllGames()
        .then(response=>{
            res.json(response);
    })
    .catch(error=>{
        res.status(500).send(error);
    })
});

app.get('/search', (req, res) => {
    const gameTitle = req.query.title;
    games.getSearchedGames(gameTitle)
        .then(response=>{
            res.json(response);
    })
    .catch(error=>{
        res.status(500).send(error);
    })
});

app.get('/users', (req, res) => {
    users.getAllUsers()
        .then(response=>{
            res.json(response);
        })
        .catch(error=>{
            res.status(500).send(error);
        })
});

app.post('/register', async (req, res) => {
    try {
        const user = await registration.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await registration.authenticateUser(req.body);
        res.json(user);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

