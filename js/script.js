/*----- constants -----*/
/*----- app's state (variables) -----*/
let weatherData, userInput;
let isFarenheit;

/*----- cached element references -----*/
const $city = $('#city_name');
const $icon = $('#weather-icon');
const $description = $('#description');
const $temperature = $('#temperature > span');
const $min = $('#min > span');
const $max = $('#max > span');
const $input = $('input[type="text"]')
const $slider = $("#temp_unit");

/*----- event listeners -----*/
$('form').on('submit', handleGetData)

//on slider change, call function to change units
$slider.change(chooseUnits);

/*----- functions -----*/

//initalize weather app
init();

function init() {
    //set Farenheit to default temp unit
    isFarenheit = true;
}

//make AJAX promise with weather data
function handleGetData(event) {
    //prevent the default behaviour of a form submission
    event.preventDefault(); 
    
    //if empty get out of function
    if($input.val() === '') return;

    //get user input
    userInput = $input.val();

    //clear the input for user-friendliness
    $input.val('');

    //get AJAX data
    $.ajax({url: `http://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=a6324eca76d5f998b021633a521fd19b`}).then(
        function(data) {
            //grab the data
            weatherData = data;
            //render the DOM accordingly
            render();

        }, function(error) {
            //show error if it doesn't work
            console.log(error)
        });
        
        
    };

//weatherData temp is in K, convert to unit of choice
function convertKtoTempUnit(temp) {
    //if toggled to F (or default)
    if (isFarenheit === true) {
        //convert to F
        return `${parseInt((temp-273.15)*9/5+32)}°F`;
    }
    //if toggle to C
    else {
        //convert to C
        return `${parseInt(temp-273.15)}°C`
    }
}
    
    
//render in the DOM   
function render() {
    
    //display city name
    $city.html(weatherData.name);

    //grab weather icon on the internet
    let weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    //display in DOM
    $icon.attr("src", weatherIcon);

    //display weather description
    $description.html(weatherData.weather[0].main);

    //display temp in correct unit
    $temperature.html(convertKtoTempUnit(weatherData.main.temp));

    //display min temp in correct unit
    $min.html(convertKtoTempUnit(weatherData.main.temp_min));

    //display max temp in correct unit
    $max.html(convertKtoTempUnit(weatherData.main.temp_max));
    
};

//define temp unit
function chooseUnits() {
    //if slider is to the left
    if ($slider.val() === '1'){
        //set boolean to true
        isFarenheit = true;
    }
    //if it is to the right
    else {
        //set boolean to false
        isFarenheit = false;
    }

    //as long as we have a chosen city, we should render 
    //the data with the new unit
    if (weatherData !== undefined) {render()};
}

