// server.js - NodeJS server for the PiThermServer project.

/* 
Parses data from DS18B20 temperature sensor and serves as a JSON object.
Uses node-static module to serve a plot of current temperature (uses highcharts).

Tom Holderness 03/01/2013
Ref: www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature/

*/

// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');

// Use node-static module to server chart for client-side dynamic graph
var nodestatic = require('node-static');

// Setup static server for current directory
var staticServer = new nodestatic.Server(".");
var jsonData= [];




// Setup node http server
var server = http.createServer(
	// Our main server function
	function(request, response)
	{
		// Grab the URL requested by the client
		var url = require('url').parse(request.url);
		var pathfile = url.pathname;

		// Test to see if it's a request for temperature data
		if (pathfile == '/temperature.json')
		{
			// Function to read thermal sensor and return JSON representation of first word (i.e. the data)
			// Note device location is sensor specific.
			fs.readFile('/sys/bus/w1/devices/10-00080293b007/w1_slave', function(err, buffer)

			{
				if (err)
				{
					response.writeHead(500, { "Content-type": "text/html" });
					response.end(err + "\n");
					console.log('Error serving /temperature.json. ' + err);
					return;
				}
			// Read data from file (using fast node ASCII encoding).
			var data = buffer.toString('ascii').split(" "); // Split by space

            		// Extract temperature from string and divide by 1000 to give celsius
			var temp  = parseFloat(data[data.length-1].split("=")[1])/1000.0;
			
			// Round to one decimal place
			temp = Math.round(temp * 10) / 10
			
			// Add date/time to temperature
			var jsonData = {
                     temperature_record:[{
                        unix_time: Date.now(), 
                        celsius: temp
                     }]};
			
			// Return JSON data	
			response.writeHead(200, { "Content-type": "application/json" });		
			response.end(JSON.stringify(jsonData), "ascii");
			// Log to console (debugging)
			// console.log('returned JSON data: ' + jsonData);
			
			});
		return;	
		}
                if (pathfile == '/now')
                {
                        // Function to read thermal sensor and return JSON representation of first word (i.e. the data)
                        // Note device location is sensor specific.
                        fs.readFile('/sys/bus/w1/devices/10-00080293b9f7/w1_slave', function(err, buffer)
                        {
                                if (err)
                                {
                                        response.writeHead(500, { "Content-type": "text/html" });
                                        response.end(err + "\n");
                                        console.log('Error serving /temperature.json. ' + err);
                                        return;
                                }
                        // Read data from file (using fast node ASCII encoding).
                        var data = buffer.toString('ascii').split(" "); // Split by space

                        // Extract temperature from string and divide by 1000 to give celsius
                        var temp  = parseFloat(data[data.length-1].split("=")[1])/1000.0;

                        // Round to one decimal place
                        temp = Math.round(temp * 10) / 10

                        // Add date/time to temperature
                        var jsonData = {
                     temperature_record:[{
                        unix_time: Date.now(),
                        celsius: temp
                     }]};

                        // Return JSON data
                        response.writeHead(200, { "Content-type": "application/json" });
                        response.end(JSON.stringify(jsonData), "ascii");
                        // Log to console (debugging)
                        // console.log('returned JSON data: ' + jsonData);

                        });

                        // Function to read thermal sensor and return JSON representation of first word (i.e. the data)
                        // Note device location is sensor specific.
                        fs.readFile('/sys/bus/w1/devices/10-00080293b007/w1_slave', function(err, buffer)
                        {
                                if (err)
                                {
                                        response.writeHead(500, { "Content-type": "text/html" });
                                        response.end(err + "\n");
                                        console.log('Error serving /temperature.json. ' + err);
                                        return;
                                }
                        // Read data from file (using fast node ASCII encoding).
                        var data = buffer.toString('ascii').split(" "); // Split by space

                        // Extract temperature from string and divide by 1000 to give celsius
                        var temp  = parseFloat(data[data.length-1].split("=")[1])/1000.0;

                        // Round to one decimal place
                        temp = Math.round(temp * 10) / 10

                        // Add date/time to temperature
                        var jsonData = {
                     temperature_record:[{
                        unix_time: Date.now(),
                        celsius: temp
                     }]};

                        // Return JSON data
                        response.writeHead(200, { "Content-type": "application/json" });
                        response.end(JSON.stringify(jsonData), "ascii");
                        // Log to console (debugging)
                        // console.log('returned JSON data: ' + jsonData);

                        });
                return;
                }

		// Handler for favicon.ico requests
		if (pathfile == '/favicon.ico'){
			response.writeHead(200, {'Content-Type': 'image/x-icon'});
			response.end();

			// Optionally log favicon requests.
			//console.log('favicon requested');
			return;
		}

                if (pathfile == '/now.json'){
                        response.writeHead(200, {'Content-Type': 'application/json',
				 'Access-Control-Allow-Origin': 'http://www.schappet.com'});
                        fs.readFile('/root/therm.now.json', function(err, buffer)
			{

			if (err != null ) {
				console.log(err);
				response.writeHead(500, { "Content-type": "text/html" });
				response.end(err + "\n");
				return;
				
			}
			var data = buffer.toString('ascii'); // Split by space
			var history = JSON.parse(data);
			response.end(JSON.stringify(history), "ascii");



			
			});

                        //response.end();
                        // Optionally log favicon requests.
                        //console.log('favicon requested');
                        return;
                }


                if (pathfile == '/range.json'){
                        response.writeHead(200, {'Content-Type': 'application/json',  'Access-Control-Allow-Origin': 'http://www.schappet.com'});
                        fs.readFile('/root/current.json', function(err, buffer)
                        {
                        if (err != null ) {
                                console.log(err);
                                response.writeHead(500, { "Content-type": "text/html" });
                                response.end(err + "\n");
                                return;

                        }

                        var data = buffer.toString('ascii'); // Split by space
                        var history = JSON.parse("[" + data + "]" );

                        var jsonData =[];
			var min ;
			var max ;
                        history.forEach(
        function(element, index, array) {
		if (min == null) { min = element };
		if (max == null) { max = element };
                var yesterday_dt = Date.now() - ( 1000 * 3600 * 24);
                if ( element.temperature_record[0].unix_time * 1000 >  yesterday_dt) {

		    if ( element.temperature_record[0].device=='10-00080293b007' &&
				 element.temperature_record[0].celsius < min.temperature_record[0].celsius ) {
				min =  element;
		    }

	           if ( element.temperature_record[0].device=='10-00080293b007' &&
                                 element.temperature_record[0].celsius > max.temperature_record[0].celsius ) {
                        max =  element;
                   }

                }
        }

                        );
			jsonData.push(min);
			jsonData.push(max);
                        console.log(JSON.stringify(jsonData));
                        response.end(JSON.stringify(jsonData), "ascii");




                        });

                        return;
                }

                if (pathfile == '/today.json'){
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        fs.readFile('/root/current.json', function(err, buffer)
                        {
                        if (err != null ) {
                                console.log(err);
                                response.writeHead(500, { "Content-type": "text/html" });
                                response.end(err + "\n");
                                return;

                        }

                        var data = buffer.toString('ascii'); // Split by space
                        var history = JSON.parse("[" + data + "]" );

                        var jsonData =[];
                        history.forEach(
        function(element, index, array) {
                var yesterday_dt = Date.now() - ( 1000 * 3600 * 24);
                if ( element.temperature_record[0].unix_time * 1000 >  yesterday_dt) {
                    jsonData.push(element);
                }
        }

                        );
                        console.log(JSON.stringify(jsonData));
                        response.end(JSON.stringify(jsonData), "ascii");




                        });

                        //response.end();
                        // Optionally log favicon requests.
                        //console.log('favicon requested');
                        return;
                }


                if (pathfile == '/history.json'){
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        fs.readFile('/root/therm.json', function(err, buffer)
                        {
                        if (err != null ) {
                                console.log(err);
                                response.writeHead(500, { "Content-type": "text/html" });
                                response.end(err + "\n");
                                return;

                        }

                        var data = buffer.toString('ascii'); // Split by space
                        response.end("[" + data + "]","ascii");
                        });

                        // Optionally log favicon requests.
                        //console.log('favicon requested');
                        return;
                }
		if (pathfile=='/') {

			var index = fs.readFileSync('index.html');
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end(index);
			return;

		}

		else {
			// Print requested file to terminal
			console.log('Request from '+ request.connection.remoteAddress +' for: ' + pathfile);

			// Serve file using node-static			
			staticServer.serve(request, response, function (err, result) {
					if (err){
						// Log the error
						//sys.error("Error serving " + request.url + " - " + err.message);
						
						// Respond to the client
						response.writeHead(err.status, err.headers);
						response.end('Error 404 - file not found');
						return;
						}
					return;	
					})
		}
});
// Enable server
server.listen(7000);
// Log message
console.log('Server running at http://localhost:7000');
