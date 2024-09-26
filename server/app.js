const express = require('express')
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here
    const userAgent = (req.header('user-agent')).replace(/,/g, '');
    const date = new Date();
    const data = `\n${userAgent},${date.toISOString()},${req.method},${req.url},HTTP/${req.httpVersion},${res.statusCode}`;
    res.locals.log = data;

    fs.appendFile("log.csv", data, "utf-8", (err) => {
        if (err) console.log(err);
    });
    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    console.log(res.locals.log);
    res.sendStatus(200);
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    csv = fs.readFileSync("log.csv");
    const contents = csv.toString();
    const rows = contents.split("\n");
    const headers = rows[0].split(",");

    const jsonData = [];
    for (let i = 1; i < rows.length; i++) {

        const values = rows[i].split(",");
        const obj = {};
        for (let j = 0; j < headers.length; j++) {

            const key = headers[j];
            const value = values[j];
            obj[key] = value;
        }
        jsonData.push(obj);
    }
    res.json(jsonData);
});

module.exports = app;