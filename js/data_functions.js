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
create_pie_chart_with_circle adds circle svg elements that represents the percentage data of a given array. 
pie_chart_id parameter is the id of a svg that contains blank start of a pie chart.
percentage_array parameter is the array that contains the percentages to make the pie chart slices.
Executes as a part of page set-up in its corresponding page js file.
**************/
function create_pie_chart_with_circle(pie_chart_id, percentage_array) {
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
		new_circle.setAttributeNS(null, "r", background_pie_chart.getAttribute("r"));
		new_circle.setAttributeNS(null, "cx", background_pie_chart.getAttribute("cx"));
		new_circle.setAttributeNS(null, "cy", background_pie_chart.getAttribute("cy"));
		new_circle.setAttributeNS(null, "class", background_pie_chart.getAttribute("class"));
		new_circle.setAttributeNS(null, "fill", "transparent");
		new_circle.setAttributeNS(null, "stroke", colors_array[i]);
		new_circle.setAttributeNS(null, "stroke-width", "50");
		new_circle.setAttributeNS(null, "stroke-dasharray", percent_out_of_circumference_array[i] + " " + (pie_chart_circumference - percent_out_of_circumference_array[i])); //color gap
		new_circle.setAttributeNS(null, "stroke-dashoffset", pie_chart_circumference - preceding_percent_out_of_circumference_total); //circumference - total length of preceding percentage out of circumferences + first dashoffset
		pie_chart_svg.appendChild(new_circle);
		
		preceding_percent_out_of_circumference_total += percent_out_of_circumference_array[i];
	}	
	
}

function polar_to_cartesian(center_x, center_y, radius, angle_in_degrees) {
  var angle_in_radians = (angle_in_degrees-90) * Math.PI / 180.0;

  return {
    x: (+center_x) + (radius * Math.cos(angle_in_radians)),
    y: (+center_y) + (radius * Math.sin(angle_in_radians))
  };
}

function describe_arc(x, y, radius, start_angle, end_angle){

    var start = polar_to_cartesian(x, y, radius, end_angle);
    var end = polar_to_cartesian(x, y, radius, start_angle);
	
    var large_arc_flag = end_angle - start_angle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, large_arc_flag, 0, end.x, end.y, //create arc
		"L", x, y, //create line segment for radius
		"Z" //close path
    ].join(" ");

    return d;       
}

/**************
create_pie_chart adds path svg elements that represents the percentage data of a given array. 
pie_chart_id parameter is the id of a svg that contains blank start of a pie chart.
percentage_array parameter is the array that contains the percentages to make the pie chart slices.
Executes as a part of page set-up in its corresponding page js file.
**************/
function create_pie_chart(pie_chart_id, percentage_array) {
	var pie_chart_svg = document.getElementById(pie_chart_id);
	var background_pie_chart = pie_chart_svg.getElementsByTagName("circle")[0];
	
	var radius = background_pie_chart.getAttribute("r");
	var center_x = background_pie_chart.getAttribute("cx");
	var center_y = background_pie_chart.getAttribute("cy");
	
	var pie_chart_circumference = background_pie_chart.getAttribute("r")*2*Math.PI;
	var slice_degrees = [];
	
	for (i = 0; i < percentage_array.length; i++) { 
		slice_degrees[i] = (percentage_array[i]/100)*360; //multiply percentage out of 360 degs
	}
	
	var preceding_slice_degree_total = 0;
	var colors_array = select_chart_colors(slice_degrees.length);
	for (i = 0; i < slice_degrees.length; i++) {
		var d_value = describe_arc(center_x, center_y, radius, preceding_slice_degree_total, preceding_slice_degree_total+slice_degrees[i]);
		
		var new_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		new_path.setAttributeNS(null, "d", d_value);
		new_path.setAttributeNS(null, "class", background_pie_chart.getAttribute("class"));
		new_path.setAttributeNS(null, "fill", colors_array[i]);
		new_path.setAttributeNS(null, "fill-opacity", "1");
		new_path.setAttributeNS(null, "stroke", colors_array[i]);
		new_path.setAttributeNS(null, "stroke-width", "0");
		new_path.setAttributeNS(null, "stroke-opacity", "1");
		pie_chart_svg.appendChild(new_path);
		
		preceding_slice_degree_total += slice_degrees[i];
	}	
	
	background_pie_chart.remove();
}
