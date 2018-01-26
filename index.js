const express = require('express'),
      path = require('path'),
      app = express(),
      bodyParser = require('body-parser'),
      exphbs = require('express-handlebars'),
      port = 3000,
      { Client } = require('pg'),
      client = new Client({
          user: 'postgres',
          host: 'localhost',
          database: 'node_hero',
          password: '1111qwerty',
          port: 5432,
      });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next)=>{
    //console.log(req.headers);
    next();
});

app.use((req, res, next)=>{
   req.chance = Math.random();
   next();
});

app.use((err, request, response, next)=>{
    if(err){
        console.log(err);
        response.status(500).send('Something broke');
    }
});

app.get('/', (request, response)=>{
    response.render('home', {
        name: 'John'
    });
});

app.post('/users', (request, response, next)=>{
    let user = request.body;

    client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], (err, result)=>{
        if(err){
            return next(err);
        }
        response.sendStatus(200);
    });

});

app.get('/users', (request, response, next)=>{

    client.query('SELECT name, age FROM users;', [], (err, result)=>{
        if(err){
            return next(err);
        }
        response.json(result.rows);
    });

});

app.listen(port ,(err)=>{
   if(err){
       return console.log('something bad happened', err);
   }

   client.connect();
   console.log(`server is listening on ${port}`);
});

