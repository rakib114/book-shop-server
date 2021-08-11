const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irvi8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log('db connection error', err);
    const booksCollection = client.db("bookHouse").collection("books");

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log('New Books', newBook);
        booksCollection.insertOne(newBook)
            .then(result => {
                res.send(result.acknowledged === true);
            })
    })

    //Getting Books from DataBase
    app.get('/books', (req, res) => {
        booksCollection.find()
            .toArray((error, books) => {
                res.send(books);
            })
    })
    //Get one book by using id
    app.get('/book/:id', (req, res) => {
        console.log('id is', req.params.id);
        booksCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, book) => {
                res.send(book);
            })
    })

    //   client.close();
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port);