const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const MONGO_URL = "mongodb://pazer:123456@ds261969.mlab.com:61969/bp-test";
const DB_NAME = 'bp-test';
const SERVER_PORT   =   8000;
let dbPointer  =   null;

MongoClient.connect(MONGO_URL, function(err, db) {
    dbPointer   =   db.db(DB_NAME);
});

const app   =   express();
app.use(cors());
app.use(bodyParser.json());

app.get('/messages', async (req, res) => {
    const messagesCollection    =   dbPointer.collection('messages');
    const messages  =   await messagesCollection.find({}).toArray();
    res.json(messages)
});

app.post('/message', async (req, res) => {
    const {email, text}   =   req.body;
    const gHash     =   crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
    const submitted     =   new Date().getTime();
    const messagesCollection    =   dbPointer.collection('messages');

    try {
        await messagesCollection.insert({email, submitted, text, gHash});
        res.json({code: 200});
    } catch (e) {
        res.json({code: 400});
    }

});

app.listen(SERVER_PORT, () => console.log(`Server on ${SERVER_PORT}`));