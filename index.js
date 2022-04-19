let config = require('./config.json')

let express = require('express');
let mustacheExpress = require('mustache-express');

let app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use ('/', require('./routes/root'));

app.listen(config.port, function() {
    console.log("Listening on port " + config.port);
});
