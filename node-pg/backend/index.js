const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


const corsOptions={
    origin:["http://localhost:5173"]
}

const games =require('./games');

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


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

