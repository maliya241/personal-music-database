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
on_hover_over_chart adds legend to give data about the chart piece of a given id and changes stylings of the chart and table so that the chart piece and its corresponding table row stand out.
chart_path_classname parameter is the classname of chart's paths
chart_path_id parameter is the id of the path that the mouse is on.
Executes on mouse over (hover).
**************/
function on_hover_over_chart(chart_path_classname, chart_path_id) {
	var chart_svg = document.getElementById(chart_path_classname);
	var chart_path = document.getElementById(chart_path_id);
	
	//create legend for hovered piece
	var chart_legend = document.createElement("p");
	chart_legend.setAttribute("id", "chart_legend");
	chart_legend.innerHTML = `<span>`+chart_path.getAttribute("data-item")+`</span><br><span>`+chart_path.getAttribute("data-count")+` (`+chart_path.getAttribute("data-percentage")+`%)</span>`;
	chart_legend.style.setProperty("border-left", "2em solid "+chart_path.getAttribute("fill"));
	chart_legend.style.setProperty("padding-left", "0.5em");
	chart_svg.parentNode.insertBefore(chart_legend, chart_svg);
	
	//change fill opacity of chart
	var chart_path_elements = document.getElementsByClassName(chart_path_classname);
	for (i = 0; i < chart_path_elements.length; i++) {
		chart_path_elements[i].setAttributeNS(null, "fill-opacity", "0.5");
	}
	
	//change stylings for chart piece
	chart_path.setAttributeNS(null, "fill-opacity", "1"); //reset fill opacity for the path that the mouse is on
	chart_path.setAttributeNS(null, "stroke-opacity", "1");
	chart_svg.appendChild(chart_path); //brings path to front of chart
	
	//change stylings for corresponding table row
	var table_row = document.getElementById(chart_path.getAttribute("data-item").toLowerCase().replaceAll(" ", "_"));
	var rgb_values = get_rgb_values(chart_path.getAttribute("fill"));
	table_row.style.setProperty("background-color", "rgba("+rgb_values[0]+", "+rgb_values[1]+", "+rgb_values[2]+", 0.5)");
	table_row.style.setProperty("outline", "2px solid rgb(0, 0, 0)");
}

/**************
on_hover_off_chart removes the legend and resets chart and table stylings.
chart_path_classname parameter is the classname of chart's paths
Executes on mouse out.
**************/
function on_hover_off_chart(chart_path_classname) {
	document.getElementById("chart_legend").remove(); //remove legend
	
	//reset styling
	var chart_path_elements = document.getElementsByClassName(chart_path_classname);
	for (i = 0; i < chart_path_elements.length; i++) {
		chart_path_elements[i].setAttributeNS(null, "fill-opacity", "1");
		chart_path_elements[i].setAttributeNS(null, "stroke-opacity", "0");
		
		document.getElementsByTagName("tr")[i].style.setProperty("background-color", "transparent");
		document.getElementsByTagName("tr")[i].style.setProperty("outline", "0 solid transparent");
	}
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

function describe_circle_sector(x, y, radius, start_angle, end_angle){

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
filter_and_count_unique_array parameter is the result of filter_and_count_unique_array function which is an array of arrays. First array is the sorted and filtered items. Second array is the count. Third array contains the percentages to make the pie chart slices. 
Executes as a part of page set-up in its corresponding page js file.
**************/
function create_pie_chart(pie_chart_id, filter_and_count_unique_array) {
	var items_array = filter_and_count_unique_array[0];
	var count_array = filter_and_count_unique_array[1];
	var percentage_array = filter_and_count_unique_array[2];
	
	var pie_chart_svg = document.getElementById(pie_chart_id);
	var chart_data = pie_chart_svg.getAttribute("data-chart-data");
	
	//pie chart values
	var radius = pie_chart_svg.getAttribute("data-pie-chart-r");
	var center_x = pie_chart_svg.getAttribute("data-pie-chart-cx");
	var center_y = pie_chart_svg.getAttribute("data-pie-chart-cy");
	
	var slice_degrees = [];
	for (i = 0; i < percentage_array.length; i++) { 
		slice_degrees[i] = (percentage_array[i]/100)*360; //multiply percentage out of 360 degs
	}
	
	var preceding_slice_degree_total = 0;
	var colors_array = select_chart_colors(slice_degrees.length);
	
	//iterate through all pie chart pieces
	for (i = 0; i < slice_degrees.length; i++) {
		var d_value = describe_circle_sector(center_x, center_y, radius, preceding_slice_degree_total, preceding_slice_degree_total+slice_degrees[i]); //calculate svg path for circle sector
		
		var chart_path_id = pie_chart_svg.getAttribute("id")+"_"+ items_array[i].toLowerCase().replaceAll(" ", "_");
		
		//create svg path element
		var new_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		new_path.setAttributeNS(null, "d", d_value);
		new_path.setAttributeNS(null, "id", chart_path_id);
		new_path.setAttributeNS(null, "class", pie_chart_svg.getAttribute("id"));
		new_path.setAttributeNS(null, "data-item", items_array[i]);
		new_path.setAttributeNS(null, "data-count", count_array[i]);
		new_path.setAttributeNS(null, "data-percentage", Math.round(percentage_array[i]));
		new_path.setAttributeNS(null, "fill", colors_array[i]);
		new_path.setAttributeNS(null, "fill-opacity", "1");
		new_path.setAttributeNS(null, "stroke", "rgb(0, 0, 0)");
		new_path.setAttributeNS(null, "stroke-width", "1");
		new_path.setAttributeNS(null, "stroke-linejoin", "round");
		new_path.setAttributeNS(null, "stroke-opacity", "0");
		new_path.setAttributeNS(null, "onmouseover", "on_hover_over_chart('"+pie_chart_svg.getAttribute("id")+"', '"+chart_path_id+"')"); //send chart path classname and path id 
		new_path.setAttributeNS(null, "onmouseout", "on_hover_off_chart('"+pie_chart_svg.getAttribute("id")+"')"); //send chart path classname
		pie_chart_svg.appendChild(new_path);
		
		preceding_slice_degree_total += slice_degrees[i];
	}	
}
