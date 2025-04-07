const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const weatherRoutes = require("./routes/weather");
app.use("/database/weather", weatherRoutes);

// aI8GCkjw2VVKA16awk84AjJnsQjVFrhi
const apiKey = "4KHbdMfsb6NUWBEHWLBJiTpeZMS6KNP5";
const geoKey = "AIzaSyDko9k4r0o1ZLTZ0hwBx8oAsc84_Ks6EZg";

const statusDict = {
    4201: "Heavy Rain", 4001: "Rain", 4200: "Light Rain", 6201: "Heavy Freezing Rain",
    6001: "Freezing Rain", 6200: "Light Freezing Rain", 6000: "Freezing Drizzle", 4000: "Drizzle",
    7101: "Heavy Ice Pellets", 7000: "Ice Pellets", 7102: "Light Ice Pellets", 5101: "Heavy Snow",
    5000: "Snow", 5100: "Light Snow", 5001: "Flurries", 8000: "Thunderstorm", 2100: "Light Fog",
    2000: "Fog", 1001: "Cloudy", 1102: "Mostly Cloudy", 1101: "Partly Cloudy", 1100: "Mostly Clear",
    1000: "Clear"
};

const statusToImg = {
    "Clear": "clear_day.svg", "Cloudy": "cloudy.svg", "Drizzle": "drizzle.svg", "Flurries": "flurries.svg",
    "Fog": "fog.svg", "Light Fog": "fog_light.svg", "Freezing Drizzle": "freezing_drizzle.svg",
    "Freezing Rain": "freezing_rain.svg", "Heavy Freezing Rain": "freezing_rain_heavy.svg",
    "Light Freezing Rain": "freezing_rain_light.svg", "Ice Pellets": "ice_pellets.svg",
    "Heavy Ice Pellets": "ice_pellets_heavy.svg", "Light Ice Pellets": "ice_pellets_light.svg",
    "Mostly Clear": "mostly_clear_day.svg", "Mostly Cloudy": "mostly_cloudy.svg",
    "Partly Cloudy": "partly_cloudy_day.svg", "Rain": "rain.svg", "Heavy Rain": "rain_heavy.svg",
    "Light Rain": "rain_light.svg", "Snow": "snow.svg", "Heavy Snow": "snow_heavy.svg",
    "Light Snow": "snow_light.svg", "Thunderstorm": "tstorm.svg", "Light Wind": "light_wind.jpg",
    "Wind": "wind.png", "Strong-Wind": "strong-wind.png"
};

const statusToImgAndroid = {
    "Clear": "clear_day.svg", "Cloudy": "cloudy.svg", "Drizzle": "drizzle.svg", "Flurries": "flurries.svg",
    "Fog": "fog.svg", "Light Fog": "fog_light.svg", "Freezing Drizzle": "freezing_drizzle.svg",
    "Freezing Rain": "freezing_rain.svg", "Heavy Freezing Rain": "freezing_rain_heavy.svg",
    "Light Freezing Rain": "freezing_rain_light.svg", "Ice Pellets": "ice_pellets.svg",
    "Heavy Ice Pellets": "ice_pellets_heavy.svg", "Light Ice Pellets": "ice_pellets_light.svg",
    "Mostly Clear": "mostly_clear_day.svg", "Mostly Cloudy": "mostly_cloudy.svg",
    "Partly Cloudy": "partly_cloudy_day.svg", "Rain": "rain.svg", "Heavy Rain": "rain_heavy.svg",
    "Light Rain": "rain_light.svg", "Snow": "snow.svg", "Heavy Snow": "snow_heavy.svg",
    "Light Snow": "snow_light.svg", "Thunderstorm": "tstorm.svg", "Light Wind": "light_wind.jpg",
    "Wind": "wind.png", "Strong-Wind": "strong-wind.png"
};

const EngWeekDict = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
const precipitationTypeDict = ["N/A", "Rain", "Snow", "Freezing Rain", "Ice Pellets"];

app.get('/', (req, res) => {
    res.send(`
        <p>Server on http://localhost:3000</p>
    `);
  //   res.send(`
  //   <p>There are two interfaces: /weatherdata and /weatherdatachart2, with longitude and latitude as parameters. The following is the examples:</p>
  //   <p>http://localhost:3000/weatherdata?latitude=42.3478&longitude=-71.0466</p>
  //   <p>http://localhost:3000/weatherdatachart2?latitude=42.3478&longitude=-71.0466</p>
  // `);
});

app.get("/googleMapResult", async (req, res) => {
    const address = req.query.address;

    if (!address) {
        return res.status(400).json({ error: "Address is required." });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDys1jsxVgTVvTSSKzEIxBRQTNkkV28Cys&language=en`;

    try {
        // Make request to Google Geocoding API
        const response = await axios.get(url);
        const data = response.data;

        // Check if the response status is OK
        if (data.status === "OK") {
            const result = data.results[0];
            res.json({
                googleMapResult: result
            });
            // const formattedAddress = result.formatted_address;
            // const latitude = result.geometry.location.lat;
            // const longitude = result.geometry.location.lng;
            //
            // // Send back the geocoding results
            // res.json({
            //     formatted_address: formattedAddress,
            //     latitude: latitude,
            //     longitude: longitude
            // });
        } else {
            // If the geocode fails, return an error
            res.status(400).json({ error: "Geocode failed", details: data.status });
        }
    } catch (error) {
        // Handle error in API request
        res.status(500).json({ error: "An error occurred while fetching the geocode data." });
    }
});

app.get('/finalprojectdata', async (req, res) => {
    console.log("----- final project data -----");
    const address = req.query.address || "Los Angeles, CA";

    // console.log("* lat/lng request");
    let loc;
    try{
        const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDys1jsxVgTVvTSSKzEIxBRQTNkkV28Cys&language=EN`);
        // console.log("raw geo: ", geoResponse);
        loc = geoResponse.data.results[0].geometry.location;
        // console.log("loc:", loc)
    }catch (error) {
        // console.error(error);
        res.json({results: "No records have been found"});
    }

    // console.log("* tomorrow.io request");
    const location = `${loc.lat},${loc.lng}`;
    const payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1d"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: [
            "temperatureMin", "temperatureMax",
            "temperature", "windSpeed", "humidity", "pressureSeaLevel", "uvIndex",
            "weatherCode", "precipitationProbability", "visibility", "cloudCover"
        ]
    };

    try {
        const weatherDataResponse = await axios.get('https://api.tomorrow.io/v4/timelines', {params: payload});
        let temperatureData = weatherDataResponse.data.data.timelines[0].intervals;
        // console.log("raw data:", temperatureData);
        let result = {
            weatherList: [],
            details: {},
        }

        const dataToday = temperatureData[0].values;
        // console.log("datatoday", dataToday);
        result.details.WindSpeed = dataToday.windSpeed;
        result.details.Pressure = dataToday.pressureSeaLevel;
        result.details.Precipitation = dataToday.precipitationProbability;
        result.details.Temperature = dataToday.temperature;
        result.details.Status = statusDict[dataToday.weatherCode];
        result.details.Humidity = dataToday.humidity;
        result.details.Visibility = dataToday.visibility;
        result.details.CloudCover = dataToday.cloudCover;
        result.details.Ozone = dataToday.uvIndex;


        temperatureData.forEach(dataSec => {
            const values = dataSec.values;
            dataSec.date = dataSec.startTime.substring(0, 10);
            dataSec.status = statusDict[values.weatherCode];
            dataSec.imgPath = "@drawable/" + statusToImg[dataSec.status].slice(0, -4);
            dataSec.tempHigh = values.temperatureMax;
            dataSec.tempLow = values.temperatureMin;
            delete dataSec.values;
            // delete dataSec.startTime
        });
        result.weatherList = temperatureData;
        res.json(result);
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
});

app.get('/datadisplay', async (req, res) => {
    console.log("----- data display -----");
    const latitude = req.query.latitude || "42.3478";
    const longitude = req.query.longitude || "-71.0466";
    const location = `${latitude},${longitude}`;

    const payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1d"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: [
            "temperature", "temperatureApparent", "temperatureMin", "temperatureMax",
            "windSpeed", "windDirection", "humidity", "pressureSeaLevel", "uvIndex",
            "weatherCode", "precipitationProbability", "precipitationType", "sunriseTime",
            "sunsetTime", "visibility", "moonPhase", "cloudCover"
        ]
    };

    let temperatureData;
    try {
        const weatherDataResponse = await axios.get('https://api.tomorrow.io/v4/timelines', {params: payload});
        temperatureData = weatherDataResponse.data.data.timelines[0].intervals;

        temperatureData.forEach(dataSec => {
            const values = dataSec.values;
            dataSec.status = statusDict[values.weatherCode];
            dataSec.imgPath = "/WeatherSymbolsWeatherCodes/" + statusToImg[dataSec.status];
            dataSec.cloudCover = values.cloudCover;
            dataSec.humidity = values.humidity;
            dataSec.tempApp = values.temperatureApparent;
            dataSec.tempHigh = values.temperatureMax;
            dataSec.tempLow = values.temperatureMin;
            dataSec.windSpeed = values.windSpeed;
            dataSec.visibility = values.visibility;
            values.precipitation = precipitationTypeDict[values.precipitationType];

            const tempSunRiseTime = new Date(new Date(values.sunriseTime).getTime() - 8 * 60 * 60 * 1000);
            const tempSunSetTime = new Date(new Date(values.sunsetTime).getTime() - 8 * 60 * 60 * 1000);

            dataSec.sunRise = tempSunRiseTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            dataSec.sunSet = tempSunSetTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});

            const date = new Date(dataSec.startTime);
            const dayOfWeek = EngWeekDict[date.getUTCDay()];
            dataSec.date = `${dayOfWeek}, ${date.getUTCDate()} ${date.toLocaleString('default', {month: 'short'})} ${date.getUTCFullYear()}`;
            delete dataSec.values;
            delete dataSec.startTime
        });
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
    console.log("result:", temperatureData);

    const chart1Payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1d"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: ["temperatureMin", "temperatureMax"]
    };

    let rawResult1;
    try {
        const chart1Response = await axios.get('https://api.tomorrow.io/v4/timelines', {params: chart1Payload});
        rawResult1 = chart1Response.data.data.timelines[0].intervals;
        rawResult1.forEach(dataSec => {
            const date = new Date(dataSec.startTime);
            const timestamp = Math.floor(date.getTime());
            dataSec.dataRow = "" + timestamp + ".0@" + dataSec.values.temperatureMin + "@" + dataSec.values.temperatureMax;
            delete dataSec.values;
            delete dataSec.startTime;
        })
        // res.json({chart1Results: rawResult});
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
    console.log("result:", rawResult1);

    const chart2Payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1h"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: ["temperature", "humidity", "windSpeed", "windDirection", "pressureSeaLevel"]
    };

    let rawResult2;
    try {
        const chart2Response = await axios.get('https://api.tomorrow.io/v4/timelines', {params: chart2Payload});
        // res.json({chart2Results: chart2Response.data.data.timelines[0].intervals});
        rawResult2 = chart2Response.data.data.timelines[0].intervals;
        rawResult2.forEach(dataSec => {
            const date = new Date(dataSec.startTime);
            const timestamp = Math.floor(date.getTime());
            dataSec.dataRow = "" + timestamp + ".0@" + dataSec.values.humidity + "@" + dataSec.values.pressureSeaLevel + "@" + dataSec.values.temperature + "@" + dataSec.values.windDirection + "@" + dataSec.values.windSpeed;
            delete dataSec.values;
            delete dataSec.startTime;
        });
        // res.json({chart2Results: rawResult});
        // return;
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
    console.log("result:", rawResult2);

    res.json({results: temperatureData, chart1Results: rawResult1, chart2Results: rawResult2});
});

app.get('/weatherdata', async (req, res) => {
    // const address = req.query.address || "LA";
    // console.log(address);
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    // let loc;
    // try{
    //     const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDys1jsxVgTVvTSSKzEIxBRQTNkkV28Cys&language=EN`);
    //     // console.log("raw geo: ", geoResponse);
    //     loc = geoResponse.data.results[0].geometry.location;
    //     console.log("loc:", loc)
    // }catch (error) {
    //     // console.error(error);
    //     res.json({results: "No records have been found"});
    // }
    //
    // const location = `${loc.lat},${loc.lng}`;
    const location = `${latitude},${longitude}`;
    console.log("weatherdata");
    // if (location === '42.3478,-71.0466') {
//     res.json(JSON.parse(`{
//   "results": [{"status":"Clear","imgPath":"/WeatherSymbolsWeatherCodes/clear_day.svg","cloudCover":97,"humidity":89.86,"tempApp":74.3,"tempHigh":74.3,"tempLow":47.08,"windSpeed":9.79,"visibility":9.94,"sunRise":"10:20 PM","sunSet":"08:55 AM","date":"Thursday, 14 Nov 2024"},{"status":"Clear","imgPath":"/WeatherSymbolsWeatherCodes/clear_day.svg","cloudCover":97.58,"humidity":78.05,"tempApp":60.75,"tempHigh":60.75,"tempLow":43.1,"windSpeed":17.17,"visibility":9.94,"sunRise":"10:21 PM","sunSet":"08:54 AM","date":"Friday, 15 Nov 2024"},{"status":"Clear","imgPath":"/WeatherSymbolsWeatherCodes/clear_day.svg","cloudCover":0.78,"humidity":80.37,"tempApp":64.54,"tempHigh":64.54,"tempLow":42.6,"windSpeed":8.63,"visibility":9.94,"sunRise":"10:22 PM","sunSet":"08:54 AM","date":"Saturday, 16 Nov 2024"},{"status":"Clear","imgPath":"/WeatherSymbolsWeatherCodes/clear_day.svg","cloudCover":2.5,"humidity":66.49,"tempApp":68.97,"tempHigh":68.97,"tempLow":41.65,"windSpeed":6.82,"visibility":15,"sunRise":"10:22 PM","sunSet":"08:53 AM","date":"Sunday, 17 Nov 2024"},{"status":"Clear","imgPath":"/WeatherSymbolsWeatherCodes/clear_day.svg","cloudCover":15.53,"humidity":62.63,"tempApp":64.75,"tempHigh":64.75,"tempLow":55.35,"windSpeed":8.74,"visibility":15,"sunRise":"10:23 PM","sunSet":"08:53 AM","date":"Monday, 18 Nov 2024"},{"status":"Cloudy","imgPath":"/WeatherSymbolsWeatherCodes/cloudy.svg","cloudCover":100,"humidity":43.86,"tempApp":66.7,"tempHigh":66.7,"tempLow":54.86,"windSpeed":7.06,"visibility":15,"sunRise":"10:24 PM","sunSet":"08:53 AM","date":"Tuesday, 19 Nov 2024"},{"status":"Mostly Clear","imgPath":"/WeatherSymbolsWeatherCodes/mostly_clear_day.svg","cloudCover":33.22,"humidity":21.41,"tempApp":74.97,"tempHigh":74.97,"tempLow":59.32,"windSpeed":8.24,"visibility":15,"sunRise":"10:25 PM","sunSet":"08:53 AM","date":"Wednesday, 20 Nov 2024"}]
// }`));
//     return;
    // }
    console.log("weatherdata random");
    const payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1d"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: [
            "temperature", "temperatureApparent", "temperatureMin", "temperatureMax",
            "windSpeed", "windDirection", "humidity", "pressureSeaLevel", "uvIndex",
            "weatherCode", "precipitationProbability", "precipitationType", "sunriseTime",
            "sunsetTime", "visibility", "moonPhase", "cloudCover"
        ]
    };

    try {
        const weatherDataResponse = await axios.get('https://api.tomorrow.io/v4/timelines', {params: payload});
        let temperatureData = weatherDataResponse.data.data.timelines[0].intervals;

        temperatureData.forEach(dataSec => {
            const values = dataSec.values;
            dataSec.status = statusDict[values.weatherCode];
            dataSec.imgPath = "/WeatherSymbolsWeatherCodes/" + statusToImg[dataSec.status];
            dataSec.cloudCover = values.cloudCover;
            dataSec.humidity = values.humidity;
            dataSec.tempApp = values.temperatureApparent;
            dataSec.tempHigh = values.temperatureMax;
            dataSec.tempLow = values.temperatureMin;
            dataSec.windSpeed = values.windSpeed;
            dataSec.visibility = values.visibility;
            values.precipitation = precipitationTypeDict[values.precipitationType];

            const tempSunRiseTime = new Date(new Date(values.sunriseTime).getTime() - 8 * 60 * 60 * 1000);
            const tempSunSetTime = new Date(new Date(values.sunsetTime).getTime() - 8 * 60 * 60 * 1000);

            dataSec.sunRise = tempSunRiseTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            dataSec.sunSet = tempSunSetTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});

            const date = new Date(dataSec.startTime);
            const dayOfWeek = EngWeekDict[date.getUTCDay()];
            dataSec.date = `${dayOfWeek}, ${date.getUTCDate()} ${date.toLocaleString('default', {month: 'short'})} ${date.getUTCFullYear()}`;
            delete dataSec.values;
            delete dataSec.startTime
        });

        console.log(temperatureData);
        res.json({results: temperatureData});
        // const chart1Payload = {
        //     apikey: apiKey,
        //     location: location,
        //     timesteps: ["1d"],
        //     timezone: ["America/Los_Angeles"],
        //     units: "imperial",
        //     fields: ["temperatureMin", "temperatureMax"]
        // };
        //
        // const chart1Response = await axios.get('https://api.tomorrow.io/v4/timelines', {params: chart1Payload});
        // const chart1Data = chart1Response.data.data.timelines[0].intervals.map(dataSec => {
        //     const tempDate = new Date(dataSec.startTime);
        //     return [
        //         tempDate.getTime(),
        //         dataSec.values.temperatureMin,
        //         dataSec.values.temperatureMax
        //     ];
        // });
        //
        // const chart2Payload = {
        //     apikey: apiKey,
        //     location: location,
        //     timesteps: ["1h"],
        //     timezone: ["America/Los_Angeles"],
        //     units: "imperial",
        //     fields: ["temperature", "humidity", "windSpeed", "windDirection", "pressureSeaLevel"]
        // };
        //
        // const chart2Response = await axios.get('https://api.tomorrow.io/v4/timelines', {params: chart2Payload});
        //
        // res.json({results: temperatureData, chart1Results: chart1Data, chart2Results: chart2Response.data});
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
});

app.get('/weatherdatachart1', async (req, res) => {
    const latitude = req.query.latitude || "42.3478";
    const longitude = req.query.longitude || "-71.0466";
    const location = `${latitude},${longitude}`;

    const chart1Payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1d"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: ["temperatureMin", "temperatureMax"]
    };

    try {
        const chart1Response = await axios.get('https://api.tomorrow.io/v4/timelines', {params: chart1Payload});
        const rawResult = chart1Response.data.data.timelines[0].intervals;
        rawResult.forEach(dataSec => {
            const date = new Date(dataSec.startTime);
            const timestamp = Math.floor(date.getTime());
            dataSec.dataRow = "" + timestamp + ".0@" + dataSec.values.temperatureMin + "@" + dataSec.values.temperatureMax;
            delete dataSec.values;
            delete dataSec.startTime;
        })
        res.json({chart1Results: rawResult});
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
});


app.get('/weatherdatachart2', async (req, res) => {
    const latitude = req.query.latitude || "42.3478";
    const longitude = req.query.longitude || "-71.0466";
    const location = `${latitude},${longitude}`;

    const chart2Payload = {
        apikey: apiKey,
        location: location,
        timesteps: ["1h"],
        timezone: ["America/Los_Angeles"],
        units: "imperial",
        fields: ["temperature", "humidity", "windSpeed", "windDirection", "pressureSeaLevel"]
    };

    try {
        const chart2Response = await axios.get('https://api.tomorrow.io/v4/timelines', {params: chart2Payload});
        // res.json({chart2Results: chart2Response.data.data.timelines[0].intervals});
        const rawResult = chart2Response.data.data.timelines[0].intervals;
        rawResult.forEach(dataSec => {
            const date = new Date(dataSec.startTime);
            const timestamp = Math.floor(date.getTime());
            dataSec.dataRow = "" + timestamp + ".0@" + dataSec.values.humidity + "@" + dataSec.values.pressureSeaLevel + "@" + dataSec.values.temperature + "@" + dataSec.values.windDirection + "@" + dataSec.values.windSpeed;
            delete dataSec.values;
            delete dataSec.startTime;
        });
        res.json({chart2Results: rawResult});
        return;
    } catch (error) {
        console.error(error);
        res.json({results: "No records have been found"});
    }
});

app.get('/autocomplete', async (req, res) => {
    const input = req.query.input;
    const apiKey = 'AIzaSyDys1jsxVgTVvTSSKzEIxBRQTNkkV28Cys';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`;

    let resStr = "";

    try {
        const response = await axios.get(url);
        const predictionList = response.data.predictions;
        for (let predict of predictionList){
            resStr += predict.terms[0].value + "@";
        }
        console.log("prediction res: ", resStr)
        res.json({predictions: resStr});
    } catch (error) {
        console.log(error)
        res.status(500).send('Error occurred while fetching data');
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000 with 3 interfaces "weatherdata", "weatherdatachart1", "weatherdatachart2"');
});
