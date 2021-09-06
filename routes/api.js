const express = require('express');             // for route
const router = express.Router();                 
const Weather = require('../models/Weather');   // mongoose schema

// the root route for weather API 
router.get('/', (req, res) => {
    res.send("This is the of weather API. Please use the following routes to fetch the data(JSON)\n" +
    "\n/api/taipei_weather\n/api/new_taipei_weather\n/api/taoyuan_weather");
});

// restful API route - taipei weather
router.get('/taipei_weather'+`?&api_key=${process.env.API_KEY}`, async (req, res) => {
    try{
        const weather = await Weather.find({locationName: '臺北市'});
        res.json(weather);
    }catch(err){
        res.json({message: err});
    }
});

// restful API route - new taipei weather
router.get('/new_taipei_weather'+`?&api_key=${process.env.API_KEY}`, async (req, res) => {
    try{
        const weather = await Weather.find({locationName: '新北市'});
        res.json(weather);
    }catch(err){
        res.json({message: err});
    }
});

// restful API route - taoyuan weather
router.get('/taoyuan_weather'+`?&api_key=${process.env.API_KEY}`, async (req, res) => {
    try{
        const weather = await Weather.find({locationName: '桃園市'});
        res.json(weather);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;