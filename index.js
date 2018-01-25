const express = require('express'),
      path = require('path'),
      app = express(),
      exphbs = require('express-handlebars');
      port = 3000;

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next)=>{
    console.log(req.headers);
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

app.listen(port ,(err)=>{
   if(err){
       return console.log('something bad happened', err);
   }

   console.log(`server is listening on ${port}`);
});

