/////////////////////////////////////////////////////////////////////////////////////
// Filename: map-api.js
// Author: Steven Quast
// Description: This JavaScript file will take user data, plot a path, calculate
// all the cities the path passes through, then give the city data to the weather API
/////////////////////////////////////////////////////////////////////////////////////

var oData = 
{
	originLat : "",
	originLong : "",
	originLoc : "",
	originTime : "",
	destinationLat : "",
	destinationLong : "",
	destinationLoc : "", 
	destinationTime : ""
};

var sGoogleMapsQueryURL = "http://maps.googleapis.com/maps/api/directions/json?";
var sGoogleMapsAPIKey = "&key=AIzaSyD6m6z0CJ7rxmo7KluF2VaMCKjq0uH7kTg";

$(document).on("click", "#submit-btn", retrieveData);

$(document).ready(displayData);

// Get Data and put it into Session Storage
function retrieveData()
{
	sessionStorage.origin = $("#start-location").val().trim();
	sessionStorage.destination = $("#destination").val().trim();
	sessionStorage.date = $("#date").val().trim();
	window.location.href = "map.html";
}

// Pass data to APIs and put it on the screen
function displayData()
{
	var mapElement = document.getElementById("map");
	if(mapElement)
	{
		var directionsService = new google.maps.DirectionsService;

        // Optionally create a map
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(mapElement,
        {
            zoom: 6,
            center: {lat: 31.9686, lng: -99.9018}
        });

        directionsDisplay.setMap(map);

        // make an API call to the directions service to make a route from origin to destination
        directionsService.route(
        {
        	origin: sessionStorage.origin,
            destination: sessionStorage.destination,
            travelMode: 'DRIVING'
        }, function(response, status) 
        {
            var directionsDiv = $("#directions");

        	// if the call worked
            if (status === 'OK') 
            {
                // Pass data to the map
                directionsDisplay.setDirections(response);

                // See the data in the console
                console.log("Returned Data: ");
                console.log(response);

                // Display directions to the screen
                var leg = response.routes[0].legs[0];
                directionsDiv.html("<h2>Directions</h2>");

                // Get current time
                var nineHours = 18 * 60 * 60 * 1000;
                var dateToPass = new Date(sessionStorage.date);
                dateToPass = new Date(dateToPass.getTime() + nineHours);
                if(dateToPass == "Invalid Date")
                {
                	dateToPass = new Date(Date.now());
                }
                console.log(dateToPass);
                oData.originTime = dateToPass.valueOf() / 1000;

                // Add each leg to the time
                dateToPass = new Date(dateToPass.getTime() + (leg.duration.value * 1000));

                // get geographical data
                oData.originLoc = leg.start_address;
                oData.destinationLoc = leg.end_address;
                oData.originLat = leg.start_location.lat();
                oData.originLong = leg.start_location.lng();
                oData.destinationLat = leg.end_location.lat();
                oData.destinationLong = leg.end_location.lng();

                // document the steps to take
                var steps = leg.steps;
                for(var stepIndex = 0; stepIndex < steps.length; stepIndex++)
                {
                	var direction = steps[stepIndex].instructions;
                	var paragraph = $("<p>");
                	paragraph.append(direction);
                	directionsDiv.append(paragraph);
                }
                	
            	// calculate estimated time of arrival
                oData.destinationTime = dateToPass.valueOf() / 1000;
                directionsDiv.append("<p><b>Total Travel Time</b></p><p>" + leg.duration.text + "</p>");
                // directionsDiv.append("<p><b>Estimated Time of Arrival:</b></p><p>" + dateToPass.toString() + "</p>");

                passData();
            } 

            // otherwise
            else 
            {
                directionsDiv.append('<p class="error">Directions request failed due to ' + status + "</p>");
                directionsDiv.append('<p class="error">Please go back and try again.</p>');
            }
        });
	}
}

// Pass all data neccessary to make an API call to the OpenWeatherMap API
function passData()
{
	console.log(oData);
	deriveForecast(oData.originLat, oData.originLong, oData.originLoc, false, oData.originTime);
	deriveForecast(oData.destinationLat, oData.destinationLong, oData.destinationLoc, false, oData.destinationTime);
}