$(function () {
    var chart;
    $(document).ready(function() {
    
        // define the options
        var options = {
    
            chart: {
                renderTo: 'container'
            },
    
            title: {
                text: 'Raspberry Pi Thermal Monitor'
            },
    
            subtitle: {
                text: 'Source: Basement Pi'
            },
    
            xAxis: {
                type: 'datetime',
                tickInterval:  3600 * 1000, // one week
                tickWidth: 0,
                gridLineWidth: 1,
                labels: {
                    align: 'left',
                    x: 3,
                    y: -3
                }
            },
    
            yAxis: [{ // left y axis
                title: {
                    text: null
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    formatter: function() {
                        return Highcharts.numberFormat(this.value, 0);
                    }
                },
                showFirstLabel: false
            }, { // right y axis
                linkedTo: 0,
                gridLineWidth: 0,
                opposite: true,
                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    formatter: function() {
                        return Highcharts.numberFormat(this.value, 0);
                    }
                },
                showFirstLabel: false
            }],
    
            legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                borderWidth: 0
            },
    
            tooltip: {
                shared: true,
                crosshairs: true
            },
    
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: this.pageX,
                                        y: this.pageY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                        this.y +' visits',
                                    width: 200
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },
    
            series: [{
                name: '10-00080293b007',
                lineWidth: 4,
                marker: {
                    radius: 4
                }
            }, {
                name: '10-00080293b9f7'
	    }]
        };
    
    

       jQuery.getJSON('history.json', 
                function(data) {
			var dataMap=[];

                        $.each(data, function(thermData, val) {
			
				var d1 = val.temperature_record[0];
				var date = new Date(d1.unix_time*1000);
				console.log(date);
				if (dataMap[d1.device] == null) {
					dataMap[d1.device]=[];
				}
				dataMap[d1.device].push([ d1.unix_time, d1.celsius ]);
                        });


			var count = 0;
			for (var key in dataMap) {
				options.series[count].data = dataMap[key];
				options.series[count++].name = key;
			}

                        chart = new Highcharts.Chart(options);
                }
        );


    });
    
});
