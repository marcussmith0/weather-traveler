/////////////////////////////////////////////////////////////////////////////////////
// Filename: map-api.js
// Author: Steven Quast
// Description: This JavaScript file will take user data, plot a path, calculate
// all the cities the path passes through, then give the city data to the weather API
/////////////////////////////////////////////////////////////////////////////////////

var oData = 
{
	origin : "",
	destination : "",
	date : ""
};

var sGoogleMapsQueryURL = "http://maps.googleapis.com/maps/api/directions/json?";
var sGoogleMapsAPIKey = "&key=AIzaSyD6m6z0CJ7rxmo7KluF2VaMCKjq0uH7kTg";

$(document).on("click", "#submit-btn", retrieveData);

$(document).ready(displayData);

function retrieveData()
{
	// console.log(Storage);
	// sessionStorage.bob = 1;
	// console.log("bob: " + sessionStorage.bob);
	sessionStorage.origin = escapeString($("#start-location").val().trim());
	sessionStorage.destination = escapeString($("#destination").val().trim());
	sessionStorage.date = escapeString($("#date").val().trim());
	window.location.href = "map.html";
	
	// displayData(oData);
}

function displayData()
{
	var mapElement = document.getElementById("map");
	console.log(mapElement);
	if(mapElement)
	{
		console.log("Origin: " + sessionStorage.origin);
		console.log("Destination: " + sessionStorage.destination);
		console.log("Date: " + sessionStorage.date);

		var sGoogleMapsParameters = "";
		sGoogleMapsParameters += "origin=" + sessionStorage.origin;
		sGoogleMapsParameters += "&destination=" + sessionStorage.destination;

		var directionsService = new google.maps.DirectionsService;
		console.log(directionsService);
        // Optionally create a map
        var directionsDisplay = new google.maps.DirectionsRenderer;
        console.log(directionsDisplay);
        var map = new google.maps.Map(mapElement,
        {
            zoom: 6,
            center: {lat: 31.9686, lng: -99.9018}
        });

        directionsDisplay.setMap(map);

        directionsService.route(
        {
        	origin: sessionStorage.origin,
            destination: sessionStorage.destination,
            travelMode: 'DRIVING'
        }, function(response, status) 
        {
            if (status === 'OK') 
            {
                // Pass data to the map
                directionsDisplay.setDirections(response);

                // See the data in the console
                console.log("Returned Data: ");
                console.log(response);

                // Display directions to the screen
                var routes = response.routes;
                var directionsDiv = $("#directions");
                directionsDiv.html("<h2>Directions</h2>");

                // Get current time
                var dateToPass = new Date(Date.now());

                for(var routeIndex = 0; routeIndex < routes.length; routeIndex++)
                {
                	var legs = routes[routeIndex].legs;
                	for(var legIndex = 0; legIndex < legs.length; legIndex++)
                	{
                		// Add each leg to the time
                		dateToPass = new Date(dateToPass.getTime() + (legs[legIndex].duration.value * 1000));
                		var steps = legs[legIndex].steps;
                		for(var stepIndex = 0; stepIndex < steps.length; stepIndex++)
                		{
                			var direction = steps[stepIndex].instructions;
                			var paragraph = $("<p>");
                			paragraph.append(direction);
                			directionsDiv.append(paragraph);
                		}
                	}
                }
                console.log(dateToPass.toDateString());
                console.log(dateToPass.toTimeString());
                console.log(dateToPass.toString());
            } 

            else 
            {
                console.log('Directions request failed due to ' + status);
            }
        });
	}


	console.log(mapElement);
	console.log(sessionStorage);

}

function escapeString(string)
{
	var sEscapedString = "";

	for(var i = 0; i < string.length; i++)
	{
		if(string[i] !== " ")
			sEscapedString += string[i];
		else
			sEscapedString += "+";
	}

	return sEscapedString;
}

