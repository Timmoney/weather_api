const mongoose = require('mongoose');

// weather schema in mongoDB
const WeatherSchema = mongoose.Schema({
    datasetDescription: String,
    locationName: String,
    time: [
        {
            startTime: String,
            endTime: String,
            parameter: {
                parameterName: String,
                parameterValue: String,
            }
        },
        {
            startTime: String,
            endTime: String,
            parameter: {
                parameterName: String,
                parameterValue: String,
            }
        },
        {
            startTime: String,
            endTime: String,
            parameter: {
                parameterName: String,
                parameterValue: String,
            }
        }
    ]
});

module.exports = mongoose.model('Weather', WeatherSchema);


