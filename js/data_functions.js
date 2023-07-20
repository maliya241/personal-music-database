/**************
get_property_values function gets the nonempty value of a given property from a given object and puts them into an array. 
data_object parameter is the name of an object. Not a string.
data_object_keyname parameter takes a string of a key name in an object.
Executes as a part of page set-up in its corresponding page js file.
**************/
function get_property_values(data_object, data_object_keyname) {
	var property_values = [];
	for (i = 0; i < data_object.length; i++) { //iterates through the data object
		if (Array.isArray(data_object[i][data_object_keyname])) { //moves each nonempty item into its own element in property_values array
			for (j = 0; j < data_object[i][data_object_keyname].length; j++) {
				if (data_object[i][data_object_keyname][j].length > 0) { // checks for nonempty values
					property_values[property_values.length] = data_object[i][data_object_keyname][j];
				}
			}
		} else if (data_object[i][data_object_keyname].length > 0) { // checks for nonempty values
			property_values[property_values.length] = data_object[i][data_object_keyname];
		}
	}
	return property_values;
}


/**************
create_pie_chart adds circle svg elements that represents the percentage data of a given array. 
pie_chart_id parameter is the id of a svg that contains blank start of a pie chart.
percentage_array parameter is the array that contains the percentages to make the pie chart slices.
Executes as a part of page set-up in its corresponding page js file.
**************/
function create_pie_chart(pie_chart_id, percentage_array) {
	var pie_chart_svg = document.getElementById(pie_chart_id);
	var background_pie_chart = pie_chart_svg.getElementsByTagName("circle")[0];
	var pie_chart_circumference = background_pie_chart.getAttribute("r")*2*Math.PI;
	var percent_out_of_circumference_array = [];
	
	for (i = 0; i < percentage_array.length; i++) { //get each percentage out of pie chart's circumference in given percentages array
		percent_out_of_circumference_array[i] = (percentage_array[i] * pie_chart_circumference)/100;
	}
	
	var preceding_percent_out_of_circumference_total = 0;
	var colors_array = select_chart_colors(percent_out_of_circumference_array.length);
	for (i = 0; i < percent_out_of_circumference_array.length; i++) {
		var new_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		new_circle.setAttributeNS(null, "r", pie_chart_svg.getElementsByTagName("circle")[0].getAttribute("r"));
		new_circle.setAttributeNS(null, "cx", pie_chart_svg.getElementsByTagName("circle")[0].getAttribute("cx"));
		new_circle.setAttributeNS(null, "cy", pie_chart_svg.getElementsByTagName("circle")[0].getAttribute("cy"));
		new_circle.setAttributeNS(null, "class", pie_chart_svg.getElementsByTagName("circle")[0].getAttribute("class"));
		new_circle.setAttributeNS(null, "fill", "transparent");
		new_circle.setAttributeNS(null, "stroke", colors_array[i]);
		new_circle.setAttributeNS(null, "stroke-width", "50");
		new_circle.setAttributeNS(null, "stroke-dasharray", percent_out_of_circumference_array[i] + " " + (pie_chart_circumference - percent_out_of_circumference_array[i])); //color gap
		new_circle.setAttributeNS(null, "stroke-dashoffset", pie_chart_circumference - preceding_percent_out_of_circumference_total); //circumference - total length of preceding percentage out of circumferences + first dashoffset
		pie_chart_svg.appendChild(new_circle);
		
		preceding_percent_out_of_circumference_total += percent_out_of_circumference_array[i];
	}	
	
}
