const http = require('http');
const fs = require('fs');
const requests = require('requests');
const { error } = require('console');
const { json } = require('stream/consumers');
const homeFile = fs.readFileSync("home.html", 'utf-8');
require('dotenv').config()

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempval%}', orgVal.main.temp)
    temperature = temperature.replace('{%tempmin%}', orgVal.main.temp_min)
    temperature = temperature.replace('{%tempmax%}', orgVal.main.temp_max)
    temperature = temperature.replace('{%location%}', orgVal.name)
    temperature = temperature.replace('{%country%}', orgVal.sys.country)
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=${process.env.APP_ID}`)
            .on('data', function (chunk) {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData)
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
    }
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is runing on the ${port}`)
})