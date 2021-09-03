const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const fastcsv = require("fast-csv")
const fs = require("fs");
const path = require('path');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({sendHeaders:false});
var accounts = [];



fs.createReadStream(path.resolve(__dirname, 'accounts.csv'))
    .pipe(fastcsv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {console.log(row); accounts.push(row)})
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
// const ws = fastcsv.format({headers:true})

// ws.pipe(process.stdout).on('end', () => process.exit());


const PORT = process.env.PORT || 3001
const app = express();

const updateCSV = (data) => {
    var path = 'accounts.csv'
    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(path, {flags: 'a'}));
    console.log("Data: ", data);
    writer.write(data);
    writer.end();
}
app.use(cors())
app.use(bodyParser.json());

app.get('/api', function(req, res) {
    console.log('called');
    console.log('test')
    res.send({result : "Hello"});
})

app.post('/accounts', function(req, res) {
    console.log('getting Account info')
    console.log(req.body)
    if (req.body.length != 0){
        accounts.push(req.body)
        updateCSV(accounts[accounts.length - 1]);
        console.log(accounts)
        
        res.send({result : "Sucess"})
    } else {
        res.send({result: "Error. Recieved Empty Body"})
    }
})

app.get('/accounts', function(req, res) {
    console.log('getting accounts');
    res.send(accounts);
})

app.get('/quit', function(req, res) {
    console.log('called quit');
    res.send({result: "Goodbye"});
})

app.listen(PORT, () => {
    console.log("listening on port:", PORT);
})

