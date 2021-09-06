# Project Title

Weather API

## Description

The endpoint API that fetches the weather information for 臺北市，新北市，桃園市 hourly.
You need to replace credential using .env file or ask me to send you a demo .env file.

## Getting Started
1. Go to root folder directory in command prompt (same level as this one)
2. npm i (to install all the dependency packages)
3. npm start 
4. open your browser type
 
    http://localhost:3000/api/taipei_weather&api_key=123456  -> 臺北市
    http://localhost:3000/api/new_taipei_weather&api_key=123456  -> 新北市
    http://localhost:3000/api/taoyuan_weather&api_key=123456  -> 桃園市

5. a json file contains weather informaion will return to the body


## Others
Port_number: depend on your local host or 3000 as default

api_key: 123456

Example
    http://localhost:{port_number}/api/taoyuan_weather&api_key={api_key}

