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

$(document).on("click", "#submit-btn", retrieveData);

$(document).ready(displayData);

function retrieveData()
{
	// console.log(Storage);
	// sessionStorage.bob = 1;
	// console.log("bob: " + sessionStorage.bob);
	sessionStorage.origin = $("#start-location").val().trim();
	sessionStorage.destination = $("#destination").val().trim();
	sessionStorage.date = $("#start-date").val().trim();
	window.location.href = "map.html";
	
	// displayData(oData);
}

function displayData()
{
	var mapElement = document.getElementById("map");
	if(mapElement)
	{
		console.log(sessionStorage.origin);
	}
	// console.log(mapElement);
	// console.log(sessionStorage);

}