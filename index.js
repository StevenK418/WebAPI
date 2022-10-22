const app = express()
const port = 3000
const books = require('./routes/books');
const home = require('./routes/home');

//Middleware: must precede routes in order to work as expected. 
app.use(express.json());
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies

app.use('/', home);

app.use('/books', books);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))