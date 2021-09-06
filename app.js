const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');                       // Hide credential
const bodyParser = require('body-parser');      // Parse json
const fetch = require('node-fetch');            // Fetch api info
const api = require('./routes/api');            // Redirect api routes
const Weather = require('./models/Weather');    // Weather schema

// Weather resources
const tapei_api = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.AUTH}&locationName=%E8%87%BA%E5%8C%97%E5%B8%82&elementName=Wx`;
const newTapei_api = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.AUTH}&locationName=%E6%96%B0%E5%8C%97%E5%B8%82&elementName=Wx`;
const taoyuan_api = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.AUTH}&locationName=%E6%A1%83%E5%9C%92%E5%B8%82&elementName=Wx`;

// Middleware
app.use('/api', api);
app.use(bodyParser.json());

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    console.log('connected to DB!')
);

// Return now time (string)
function nowTime(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date+' '+time);
}

// Save data to online mongoDB
async function saveToDB(record){
    // Weather Schema
    let dataDesc = record.datasetDescription;
    let locName = record.location[0].locationName;
    let time = record.location[0].weatherElement[0].time;

    let t1s = time[0].startTime;
    let t1e = time[0].endTime;
    let p1n = time[0].parameter.parameterName;
    let p1v = time[0].parameter.parameterValue;

    let t2s = time[1].startTime;
    let t2e = time[1].endTime;
    let p2n = time[1].parameter.parameterName;
    let p2v = time[1].parameter.parameterValue;

    let t3s = time[2].startTime;
    let t3e = time[2].endTime;
    let p3n = time[2].parameter.parameterName;
    let p3v = time[2].parameter.parameterValue;

    let weather = new Weather({
        datasetDescription: dataDesc,
        locationName: locName,
        time: [
            {
                startTime: t1s,
                endTime: t1e,
                parameter: {
                    parameterName: p1n,
                    parameterValue: p1v,
                }
            },
            {
                startTime: t2s,
                endTime: t2e,
                parameter: {
                    parameterName: p2n,
                    parameterValue: p2v,
                }
            },
            {
                startTime: t3s,
                endTime: t3e,
                parameter: {
                    parameterName: p3n,
                    parameterValue: p3v,
                }
            }
        ]
    })

    // Remove old records
    try {
        await Weather.deleteOne({locationName: locName});
    }catch(err){
        console.log(err)
    }

    // Save new records
    weather.save()
    .then(()=>{
        console.log(`Update MongoDB -> ${locName}`, nowTime());
    })
    .catch(err => {
        console.log(err);
    })
}

// Fetch info from cwd.gov to database
async function updateWeatherInfo(){
    let urlList = [tapei_api, newTapei_api, taoyuan_api];
    const promiseList = urlList.map((url) => {
        return fetch(url)
        .then(data => data.json())
        .then(data => {
            saveToDB(data.records);
        })
        .catch(err => {
            console.log(err);
        })
    });

    Promise.all(promiseList)
    .then(()=>{    
        console.log('\nAll weather info is updated');
    })
    .catch(err => {
        console.log(err);
    })
}

// Update info every hour
updateWeatherInfo();
let intervalID = setInterval(updateWeatherInfo, 1000*60*60);

// Listen on the host port or 3000
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Weather app start now listening on port ${port}`);
});