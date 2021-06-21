const express = require('express');
const app = express();
const path = require('path');
var expressHbs = require('express-handlebars');

const PORT = process.env.PORT || 4563

app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));


app.set('view engine', 'hbs');


var hbs = expressHbs.create({});


// hbs.handlebars.registerHelper('times', function(n, block) {
//     var accum = '';
//     for(var i = 0; i < n; ++i)
//         accum += block.fn(i);
//     return accum;
// });


hbs.handlebars.registerHelper('for', function (from, to, incr, block) {
    var accum = '';
    for (var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
    res.render('number', {
        layout: false
    });
});

let number;

app.post('/', (req, res) => {
    number = req.body.number;
    res.redirect('/names')
});

let players = []

app.get('/names', (req, res) => {
    if (number == null) {
        return res.render('number', {
            layout: false
        });
    }
    players = []
    res.render('names', {
        layout: false,
        number
    })
})

app.post('/names', (req, res) => {
    for (let i = 0; i < number; i++) {
        players.push(req.body[i])
    }
    res.redirect('/game')
})

let player1;
let player2;


function getPlayer1() {
    player1 = players[Math.floor(Math.random() * number)]
    return
}

function getPlayer2() {
    player2 = players[Math.floor(Math.random() * number)]
    while (player2 == player1) {
        player2 = players[Math.floor(Math.random() * number)]
    }
    return
}



app.get('/game', (req, res) => {
    if (players.length == 0) {
        return res.render('number', {
            layout: false
        })
    }
    getPlayer1()
    getPlayer2()
    Assigntask()
    res.render('game', {
        layout: false,
        player1,
        player2
    })
})

app.post('/game', (req, res) => {
    players = []
    number = null
    player1 = null
    player2 = null
    res.redirect('/')
})



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
