const express = require('express');
const https = require('https');
const fs = require('fs');
const server = express();

const maria = require("./maria");
maria.connect();

const cors = require('cors');
const { fstat } = require('fs');
server.use(cors());

option = {
    key: fs.readFileSync('/OpenSSL-Win64/key.pem'),
    cert: fs.readFileSync('/OpenSSL-Win64/cert.pem'),
    passphrase: '1q2w3e4r',
    agent: false
}

server.get('/board', (req, res) => {
    maria.query('select * from board', function (err, rows) {
        if (!err) {
            console.log("selecting~");
            res.send(rows);
        } else {
            console.log("error: " + err);
            res.send(err);
        }
    });
});

server.delete('/postDelete/:id', (req, res) => {
    let postId = req.params.id;

    maria.query('delete from board where id = ?', [postId], function (err, rows) {
        if (!err) {
            console.log("delete success~");
            res.send("delete success!");
        } else {
            console.log("error: " + err);
            res.send(err);
        }
    });
});

server.get('/postInsert', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const writer = req.body.writer;
    const password = req.body.password;
    const date = req.body.date;

    maria.query('insert into board (title, content, writer, password, date) values (?, ?, ?, ?, ?)', [title, content, writer, password, date], function (err, rows) {
        if (!err) {
            console.log("insert success~");
            res.send("insert success!");
        } else {
            console.log("error: " + err);
            res.send(err);
        }
    });
});

const host = "175.215.49.230";
const port = 3001;

https.createServer(option, server).listen(port, function () {
    console.log("server listening on port 3001");
});