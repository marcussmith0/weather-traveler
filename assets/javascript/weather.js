

    function deriveForecast(lattitude, longitude, location, currentTime=true, date){
          //Temporary varialble for local testing. Arrival Time 

          if (currentTime === false){
          
          var utcSeconds = date;
          console.log(date);
          var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
          console.log(d);
          var arrivalDateUTCSeconds  = d.setUTCSeconds(utcSeconds);

          var arrivalDateCST = new Date(arrivalDateUTCSeconds);
          console.log(arrivalDateCST);
         

         
       

          var arrivalYearUTC = arrivalDateCST.getUTCFullYear();
          console.log(arrivalYearUTC);
          var arrivalMonthUTC = arrivalDateCST.getUTCMonth();
          arrivalMonthUTC = arrivalMonthUTC +1; 
          var arrivalDayUTC = arrivalDateCST.getUTCDate(); 

          for (i=1; i<10; i++){
             if (arrivalDayUTC === i){
               arrivalDayUTC = "0" + arrivalDayUTC;
             }

             if(arrivalMonthUTC===i){
               arrivalMonthUTC = "0" + arrivalMonthUTC;
             }
           }


           var arrivalHourUTC = arrivalDateCST.getUTCHours();
           var arrivalMinuteUTC = arrivalDateCST.getUTCMinutes();

           var arrivalDate = arrivalYearUTC + "-" + arrivalMonthUTC + "-" + arrivalDayUTC + " " + arrivalHourUTC + ":" + arrivalMinuteUTC +":00";

           console.log(arrivalDate);



          //reformat arrival time and assign to variable
          var arrivalMoment = moment(arrivalDate,  "YYYY-MM-DD HH:mm:ss").utc();
          console.log(arrivalMoment);

          //reformat current time in UTC and assign to variable
          var currentDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");
          console.log(currentDate);

          //Determine difference in hours between Arrival and Destination times.
          var nDiffinHours1 = arrivalMoment.diff(currentDate, 'hours')
          console.log(nDiffinHours1);

          //if difference in time is less than 120 hours (5 days), pull weather from 5 day forcast to take advantage of 3 hour granularity
          if(nDiffinHours1 < 120) {

                  // This is our API key
                  var APIKey = "f612aaf933e46eae9aa3e2f51d134994";

                 var queryURL = "https://infinite-sea-83734.herokuapp.com/api/openWeather5/" + lattitude + "/" + longitude;
                  // Here we are building the URL we need to query the database
                  //var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lattitude + "&lon="+ longitude +"&appid=" + APIKey;

                  // Here we run our AJAX call to the OpenWeatherMap API
                  $.ajax({
                          url: queryURL,
                          method: "GET"

                  })

                  // We store all of the retrieved data inside of an object called "response"
                  .done(function(response) {

                              // Log the queryURL
                              console.log(queryURL);

                              // Log the resulting object
                              console.log(response);

                              // Transfer content to HT
                              //$(".city").html("<h1>" + response.city.name + " Weather Details</h1>");
                          

                              //set current hour to element "0" & update current date with new hour.        
                              var currentDateViaWeather = response.list[0].dt_txt;
                              var currentMoment = moment(currentDateViaWeather, "YYYY-MM-DD HH:mm:ss").utc();
                              console.log(currentMoment);

                            
                              var nDiffinHours = arrivalMoment.diff(currentMoment, 'hours') // 1
                              console.log(nDiffinHours);


                              //Identify the corresponding ariivalTime in the Array from the Weather API by dividing travelled time by 3.
                              var targetElementDecimal = nDiffinHours/3;
                              console.log(targetElementDecimal);

                              var targetElement = Math.round(targetElementDecimal);
                              console.log(targetElement);

                              console.log(response.list[targetElement]);


                              //get weatheratArrivalTime and assign to variable and convert to Farenheit
                              var weatherDescription = response.list[targetElement].weather[0].description;
                              var weatheratArrivalTime = response.list[targetElement].main.temp;
                              var f = (((9/5) * (weatheratArrivalTime - 273) + 32).toFixed(0)) + " °F";
                              console.log(f);

                              var farenheitDiv = $("<div>");
                              farenheitDiv.text(location);
                              farenheitDiv.append("<br>" + f );
                              farenheitDiv.append("<br>" + weatherDescription + "<br><br>" );
                              $("#arrival").append(farenheitDiv);
                             
                  //closes API response
                  });
          //Closes If hours <120 statement
          }

          else if (nDiffinHours1>= 120){

                   // This is our API key
                  var APIKey = "f612aaf933e46eae9aa3e2f51d134994";

                  // Here we are building the URL we need to query the database
                  //var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=houston,us&appid=" + APIKey;
                  //var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lattitude +"&lon="+longitude+"&cnt=16&appid=" + APIKey;
                var queryURL = "https://infinite-sea-83734.herokuapp.com/api/openWeather16/" + lattitude + "/" + longitude;

                  // Here we run our AJAX call to the OpenWeatherMap API
                  $.ajax({
                          url: queryURL,
                          method: "GET"
                  })

                  // We store all of the retrieved data inside of an object called "response"
                  .done(function(response) {

                              // Log the queryURL
                              console.log(queryURL);

                              // Log the resulting object
                              console.log(response);

                              // Transfer content to HT
                              //$(".city").html("<h1>" + response.city.name + " Weather Details</h1>");                          

                              //set current day to element "0".     
                              var currentDateViaWeather = response.list[0].dt;
                              console.log(currentDateViaWeather);
                              var day = moment.unix(currentDateViaWeather);
                              console.log(day);

                              //convert date format of arrival time to match date format of current time in preparation for calculating "time travelled" in next step.
                              var currentMoment = moment(day.year() + "-" + (day.month()+1)+ "-" + day.date() + " " + day.hour() + ":" + day.minute() +  "0" + ":" + day.second() + "0" , "YYYY-MM-DD HH:mm:ss").utc();
                              console.log(currentMoment);
                              console.log(arrivalMoment);                          

                              //Get time travalled in days to find target element
                              var targetElement = arrivalMoment.diff(currentMoment, 'days') // 1
                              console.log("Number of days travelled between (number of days travelled): " + targetElement);

                              //get weatheratArrivalTime and assign to variable and convert to Farenheit
                              //var weatherDescription = response.list[targetElement].weather[0].description;
                              var weatherDescription = response.list[targetElement].weather[0].description;
                              var weatheratArrivalTime = response.list[targetElement].temp.day;
                              var f = (((9/5) * (weatheratArrivalTime - 273) + 32).toFixed(0)) + " °F";
                              console.log(f);

                              var farenheitDiv = $("<div>");
                              farenheitDiv.text(location);
                              farenheitDiv.append("<br>" + f );
                              farenheitDiv.append("<br>" + weatherDescription + "<br><br>" );
                              $("#arrival").append(farenheitDiv);
                  //closes API response
                  });
                 
          //closes "else-if" statement
          }
        }
        //cloases if current time= fales
        else if (currentTime === true){

               var queryURL = "https://infinite-sea-83734.herokuapp.com/api/openWeather5/" + lattitude + "/" + longitude;
                  // Here we are building the URL we need to query the database
                  //var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lattitude + "&lon="+ longitude +"&appid=" + APIKey;

                  // Here we run our AJAX call to the OpenWeatherMap API
                  $.ajax({
                          url: queryURL,
                          method: "GET"

                  })

                  // We store all of the retrieved data inside of an object called "response"
                  .done(function(response) {
              console.log(response);

                //$(".city").html("<h1>" + response.city.name + " Weather Details</h1>");
             
               var weatherDescription = response.list[0].weather[0].description; //Rainy or sunny etc.. 
               var weatheratArrivalTime = response.list[0].main.temp;
               var f = (((9/5) * (weatheratArrivalTime - 273) + 32).toFixed(0)) + " °F";
               console.log(f);

                var farenheitDiv = $("<div>");
                farenheitDiv.text(location);
                farenheitDiv.append("<br>" + f );
                farenheitDiv.append("<br>" + weatherDescription + "<br><br>" );
               $("#departure").append(farenheitDiv);
             });


        }
    //closes deriveFunction 
    }

        
    
    //Calls DeriveFunction

    // var lattitude = "35.01";
    // var longitude = "139.01";
    // var date = "1493490600";
    // // // april 29th 9:00 UTC = 1493499600
    // // //april 29th 8:30 UTC = 1493497800
    // // //     http://www.unixtimestamp.com/index.php
    // deriveForecast(lattitude, longitude,false, date);
    // deriveForecast(lattitude, longitude);
