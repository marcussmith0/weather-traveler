/////////////////////////////////////////////////////////////////////////////////////
// Filename: map-api.js
// Author: Steven Quast
// Description: This JavaScript file will take user data, plot a path, calculate
// all the cities the path passes through, then give the city data to the weather API
/////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", "#submit-btn", retrieveData);



function retrieveData()
{
	var sOrigin = $("#start-location").val().trim();
	var sDestination = $(#destination).val().trim();
	var sDate = $("#start-date").val().trim();
}