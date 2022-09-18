const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {

    res.render("home");

});

app.post("/", function(req, res) {

    const query = req.body.cityName;
    const unit = "metric";
    const apiKey = process.env.API_KEY;

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    https.get(url, function(response) {
        const statusCode = response.statusCode;

        if (statusCode === 200) {
            response.on("data", function(data) {
                const weatherData = JSON.parse(data);
                const country = weatherData.sys.country;
                const city = weatherData.name;
                const temp = Math.round(weatherData.main.temp);
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    
                res.render("result", {
                    iconURL: imageURL,
                    temperature: temp,
                    desc: description.charAt(0).toUpperCase() + description.slice(1),
                    location: city + ", " + country
                });
            })
        } else {
            res.send("Invalid City Name.");
        }
        
        
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function()  {
    console.log('Server started on port ${PORT}...');
});
