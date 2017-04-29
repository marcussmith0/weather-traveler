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
	originTime : "",
	destinationLat : "",
	destinationLong : "", 
	destinationTime : "",
	originSet : false,
	destinationSet : false,
	timeSet : false
};

var sGoogleMapsQueryURL = "http://maps.googleapis.com/maps/api/directions/json?";
var sGoogleMapsAPIKey = "&key=AIzaSyD6m6z0CJ7rxmo7KluF2VaMCKjq0uH7kTg";

$(document).on("click", "#submit-btn", retrieveData);

$(document).ready(displayData);

// Get Data and put it into Session Storage
function retrieveData()
{
	sessionStorage.origin = escapeString($("#start-location").val().trim());
	sessionStorage.destination = escapeString($("#destination").val().trim());
	sessionStorage.date = escapeString($("#date").val().trim());
	window.location.href = "map.html";
}

// Pass data to APIs and put it on the screen
function displayData()
{
	var mapElement = document.getElementById("map");
	if(mapElement)
	{
		console.log("Origin: " + sessionStorage.origin);
		console.log("Destination: " + sessionStorage.destination);
		console.log("Date: " + sessionStorage.date);

		var directionsService = new google.maps.DirectionsService;
		var geocoder = new google.maps.Geocoder();

		// Get Geocode Coordinates to pass to the Weather Map API

		var latitude;
		var longitude;

		// make an API call to the geocoder for the origin
		geocoder.geocode({'address': sessionStorage.origin}, function(results, status)
			{
				// if it worked, store data and check for completion
				if (status == 'OK') 
				{
					var latLng = results[0].geometry.location;
					oData.originLat = latLng.lat().toString();
					oData.originLong = latLng.lng().toString();
					oData.originSet = true;
					checkStatus();
      			} 

      			// otherwise
      			else 
      			{
        			$("#directions").append('<p class="error">Geocode was not successful for the following reason: ' + status + '</p>');
      			}
			});

		// make an API call to the geocoder for the destination
		geocoder.geocode({'address': sessionStorage.destination}, function(results, status)
			{
				// if it worked, store data and check for completion
				if (status == 'OK') 
				{
					var latLng = results[0].geometry.location;
					oData.destinationLat = latLng.lat().toString();
					oData.destinationLong = latLng.lng().toString();
					oData.destinationSet = true;
					checkStatus();
      			} 

      			// otherwise
      			else 
      			{
        			$("#directions").append('<p class="error">Geocode was not successful for the following reason: ' + status + '</p>');
      			}
			});

		// console.log(latitude);
		// console.log(longitude);
		// console.log(directionsService);


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
                var routes = response.routes;
                directionsDiv.html("<h2>Directions</h2>");

                // Get current time
                var nineHours = 18 * 60 * 60 * 1000;
                var dateToPass = new Date(sessionStorage.date);
                dateToPass = new Date(dateToPass.getTime() + nineHours);
                if(dateToPass == "Invalid Date")
                {
                	console.log("invalid");
                	dateToPass = new Date(Date.now());
                }
                console.log(dateToPass);
                oData.originTime = dateToPass.valueOf() / 1000;

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

                oData.destinationTime = dateToPass.valueOf() / 1000;
                oData.timeSet = true;
                directionsDiv.append("<p><b>Total Travel Time</b></p><p>" + legs[0].duration.text + "</p>");
                directionsDiv.append("<p><b>Estimated Time of Arrival:</b></p><p>" + dateToPass.toString() + "</p>");
                console.log(dateToPass.toDateString());
                console.log(dateToPass.toTimeString());
                console.log(dateToPass.toString());

                checkStatus();
            } 

            // otherwise
            else 
            {
                directionsDiv.append('<p class="error">Directions request failed due to ' + status + "</p>");
            }
        });
	}
}

// Make sure all data neccessary to make an API call to the OpenWeatherMap API is ready
function checkStatus()
{
	// if everything is ready
	if(oData.originSet && oData.destinationSet && oData.timeSet)
	{
		console.log("We Got 'em");
		// sending off origin data
		// if (sessionStorage.date == )
		deriveForecast(oData.originLat, oData.originLong);
		deriveForecast(oData.destinationLat, oData.destinationLong, false, oData.destinationTime);

	}
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

