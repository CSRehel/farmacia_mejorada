const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // ya no se necesita ***
const { engine } = require('express-handlebars');

const { config } = require('./config/config');
const routerApi = require('./routes/index');

const app = express();

/////////////////////////////////////////////////////////////////////////////////

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

/////////////////////////////////////////////////////////////////////////////////

routerApi(app);

app.get('*', (req, res) => {
    res.render('Error', { message: 'página no encontrada', code: 404});
});

app.listen(config.port, console.log(`SERVER ON PORT ${config.port}`));