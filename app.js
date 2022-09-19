const express = require('express')
const path = require('path')
const fetch = require('node-fetch');

const app = express()
const port = 3000
var temp;
var state = " ";
var min = " ";
var max = " ";
var humidity = " ";
var locCity = " ";
var locRegion = " ";
var icon;
var lat;
var lon;
var key;
var errorMessage = " ";


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true})) //allows server to access html body

//gets page for client
app.get('/',function (req,res){

    res.render("index",{
        errorMessage: errorMessage,
        icon: icon,
        temperature: temp,
        min: min,
        humidity:humidity,
        max:max,
        State: state,
        location: locCity + "," + locRegion});

})

//gets user input
app.post("/",(req,res)=>{
    value = req.body.textfield;
    value = value.toString();
    locCity = value;
    key = "040b5d852e287eae9673f17c421f1d5c";

    //gets the longitude and latitude of user input (city)
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" +value+"&limit=5&appid=" + key)
        .then(response => response.json()).then((response)=>{

        lat = response[1].lat;
        lon = response[1].lon;

        getWeather(); //gets weather details of city

    }).catch((error)=>{ //if user input is not a city
        res.render("index",{
            errorMessage: "City not Found." +
                "Try checking for spelling mistakes",
            icon: " ",
            temperature: " ",
            min: " ",
            humidity:" ",
            max:" ",
            State: " ",
            location: " "});


    })
    //fetches weather of city
    function getWeather() {
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial")
            .then(response => response.json()).then((response) => {

            temp = Math.round(response.main.temp);
            state = response.weather[0].main;
            min = Math.round(response.main.temp_min);
            max = Math.round(response.main.temp_max);
            humidity = response.main.humidity;
            locRegion = response.sys.country;

            //rerender page with city information
            res.render("index",{
                errorMessage: errorMessage,
                icon: icon,
                temperature: temp,
                min: min,
                humidity:humidity,
                max:max,
                State: state,
                location: locCity + "," + locRegion});


        });
    }



})

app.listen(port,function (){
    console.log(`server running on http://localhost:${port}`);
});


