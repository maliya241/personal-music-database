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
	var chart_legend = document.getElementById(chart_path_classname+"_legend");
	
	//create color swatch for legend
	var color_swatch = document.createElement("span");
	color_swatch.style.setProperty("display", "inline-block");
	color_swatch.style.setProperty("height", "2em");
	color_swatch.style.setProperty("width", "2em");
	color_swatch.style.setProperty("background-color", chart_path.getAttribute("fill"));
	color_swatch.style.setProperty("border", "0.5px solid rgb(0, 0, 0)");	
	color_swatch.style.setProperty("border-radius", "0.25px");	
	chart_legend.appendChild(color_swatch);
	
	//create text for legend
	var legend_text = document.createElement("span");
	legend_text.style.setProperty("display", "inline-block");
	legend_text.style.setProperty("padding-left", "0.5em");
	legend_text.innerHTML = chart_path.getAttribute("data-item")+`<br>`+chart_path.getAttribute("data-count")+` (`+chart_path.getAttribute("data-percentage")+`%)`;
	chart_legend.appendChild(legend_text);
	
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
	document.getElementById(chart_path_classname+"_legend").innerHTML = ""; //remove legend
	
	//reset styling
	var chart_path_elements = document.getElementsByClassName(chart_path_classname);
	for (i = 0; i < chart_path_elements.length; i++) {
		chart_path_elements[i].setAttributeNS(null, "fill-opacity", "1");
		chart_path_elements[i].setAttributeNS(null, "stroke-opacity", "0");
		
		document.getElementsByTagName("tr")[i].style.setProperty("background-color", "transparent");
		document.getElementsByTagName("tr")[i].style.setProperty("outline", "0 solid transparent");
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
	var chart_viewbox_object = pie_chart_svg.viewBox.baseVal;	
	var chart_data = pie_chart_svg.getAttribute("data-chart-data");
	
	var chart_padding = pie_chart_svg.getAttribute("data-pie-chart-padding-decimal-percentage")*chart_viewbox_object.width;
	var chart_legend_height = pie_chart_svg.getAttribute("data-pie-chart-legend-decimal-percentage")*chart_viewbox_object.height;
	
	//add text styling for chart legend
	pie_chart_svg.innerHTML = `<style>
	.legend_element {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.legend_element {
		color: rgb(0, 0, 0);
		font-size: `+0.25*(chart_viewbox_object.width/100)+`rem; <!-- font size is calculated based on the svg viewbox height -->
		text-align: center;
	}
</style>`;
	
	//chart legend for on hover event
	var legend_element = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
	legend_element.setAttributeNS(null, "x", chart_padding);
	legend_element.setAttributeNS(null, "y", chart_padding);
	legend_element.setAttributeNS(null, "width", chart_viewbox_object.width-chart_padding);
	legend_element.setAttributeNS(null, "height", chart_legend_height);
	pie_chart_svg.appendChild(legend_element);
	legend_element.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" id="`+pie_chart_id+`_legend" class="legend_element"></div>`;
	
	//pie chart values
	var radius = (+pie_chart_svg.getAttribute("data-pie-chart-r-decimal-percentage"))*chart_viewbox_object.width;
	var center_x = (+pie_chart_svg.getAttribute("data-pie-chart-cx-decimal-percentage"))*chart_viewbox_object.width;
	var center_y = ((+pie_chart_svg.getAttribute("data-pie-chart-cy-decimal-percentage"))*chart_viewbox_object.height)+chart_legend_height; //must account for legend height
	
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

/**************
create_horizontal_bar_chart 
horizontal_bar_chart_id parameter is the id of a svg that contains blank start of a horizontal bar chart.
filter_and_count_unique_array parameter is the result of filter_and_count_unique_array function which is an array of arrays. First array is the sorted and filtered items. Second array is the count. Third array contains the percentages to make the pie chart slices. 
max_count parameter is the largest count value of filter_and_count_unique_array.
Executes as a part of page set-up in its corresponding page js file.
**************/
function create_horizontal_bar_chart(horizontal_bar_chart_id, filter_and_count_unique_array, max_count) {
	var items_array = filter_and_count_unique_array[0];
	var count_array = filter_and_count_unique_array[1];
	var percentage_array = filter_and_count_unique_array[2];
	
	var horizontal_bar_chart_svg = document.getElementById(horizontal_bar_chart_id);
	var chart_viewbox_object = horizontal_bar_chart_svg.viewBox.baseVal;	
	var chart_data = horizontal_bar_chart_svg.getAttribute("data-chart-data");
	
	//add text styling for chart text
	horizontal_bar_chart_svg.innerHTML = `<style>
	.legend_element {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.x_axis_label {
		margin: 0;
		position: absolute;
		bottom: 0%;
		left: 50%;
		-ms-transform: translateX(-50%);
		transform: translateX(-50%);
	}
	.x_axis_label_span, .legend_element {
		color: rgb(0, 0, 0);
		font-size: `+0.25*(chart_viewbox_object.width/100)+`rem; <!-- font size is calculated based on the svg viewbox height -->
		text-align: center;
	}
	
	.y_axis_label {
		margin: 0;
		position: absolute;
		top: 50%;
		right: 0%;
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
	}
		
	.y_axis_label_span {
		color: rgb(0, 0, 0);
		font-size: `+0.25*(chart_viewbox_object.height/100)+`rem; <!-- font size is calculated based on the svg viewbox height -->
		text-align: right;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 2; /* number of lines to show */
        line-clamp: 2; 
		-webkit-box-orient: vertical;
	}
</style>`;
	
	var chart_padding = horizontal_bar_chart_svg.getAttribute("data-horizontal-bar-chart-padding-decimal-percentage")*chart_viewbox_object.width;
	var chart_legend_height = horizontal_bar_chart_svg.getAttribute("data-horizontal-bar-chart-legend-decimal-percentage")*chart_viewbox_object.height;

	//horizontal bar chart axes points
	var x_axis_left_point = (+horizontal_bar_chart_svg.getAttribute("data-horizontal-bar-chart-x-axis-left-point-decimal-percentage"))*chart_viewbox_object.width;
	var x_axis_right_point = (+horizontal_bar_chart_svg.getAttribute("data-horizontal-bar-chart-x-axis-right-point-decimal-percentage"))*chart_viewbox_object.width;
	var y_axis_top_point = ((+horizontal_bar_chart_svg.getAttribute("data-horizontal-bar-chart-y-axis-top-point-decimal-percentage"))*chart_viewbox_object.height)+chart_legend_height; //must account for legend height
	var y_axis_bottom_point = (+horizontal_bar_chart_svg.getAttribute("data-horizontal-bar-chart-y-axis-bottom-point-decimal-percentage"))*chart_viewbox_object.height;

	//chart legend for on hover event
	var legend_element = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
	legend_element.setAttributeNS(null, "x", chart_padding);
	legend_element.setAttributeNS(null, "y", chart_padding);
	legend_element.setAttributeNS(null, "width", chart_viewbox_object.width-chart_padding);
	legend_element.setAttributeNS(null, "height", chart_legend_height);
	horizontal_bar_chart_svg.appendChild(legend_element);
	legend_element.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" id="`+horizontal_bar_chart_id+`_legend" class="legend_element"></div>`;

	//create x axis
	var x_axis_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	x_axis_path.setAttributeNS(null, "d", "M"+x_axis_left_point+" "+y_axis_top_point+" H"+x_axis_right_point);
	x_axis_path.setAttributeNS(null, "stroke", "rgb(0, 0, 0)");
	x_axis_path.setAttributeNS(null, "stroke-width", "0.5");
	x_axis_path.setAttributeNS(null, "stroke-linecap", "round");
	x_axis_path.setAttributeNS(null, "stroke-opacity", "1");
	horizontal_bar_chart_svg.appendChild(x_axis_path);
	
	//create y axis
	var y_axis_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	y_axis_path.setAttributeNS(null, "d", "M"+x_axis_left_point+" "+y_axis_top_point+" V"+y_axis_bottom_point);
	y_axis_path.setAttributeNS(null, "stroke", "rgb(0, 0, 0)");
	y_axis_path.setAttributeNS(null, "stroke-width", "0.5");
	y_axis_path.setAttributeNS(null, "stroke-linecap", "round");
	y_axis_path.setAttributeNS(null, "stroke-opacity", "1");
	horizontal_bar_chart_svg.appendChild(y_axis_path);
	
	//calculate percentage of count from max count that is rounded up at the tens place
	var bar_percentage_array = [];
	var rounded_max_count = Math.ceil((+max_count)/10)*10;
	for (i = 0; i < count_array.length; i++) {
		bar_percentage_array[i] = count_array[i]/rounded_max_count;
	}
	
	var x_axis_label_interval = rounded_max_count/4;
	var x_axis_label_interval_point = ((x_axis_right_point-x_axis_left_point)/4);
	
	//create x axis labels and guides
	for (i = 0; i < 5; i++) {
		//create corresponding label
		var x_axis_label = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		x_axis_label.setAttributeNS(null, "x", (x_axis_left_point+(x_axis_label_interval_point*i))-(x_axis_label_interval_point/2));
		x_axis_label.setAttributeNS(null, "y", chart_padding);
		x_axis_label.setAttributeNS(null, "width", x_axis_label_interval_point);
		x_axis_label.setAttributeNS(null, "height", y_axis_top_point-chart_padding);
		horizontal_bar_chart_svg.appendChild(x_axis_label);
		x_axis_label.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="x_axis_label"><span xmlns="http://www.w3.org/1999/xhtml" class="x_axis_label_span">`+(x_axis_label_interval*i)+`</span></div>`;
		
		//create x axis label guide
		var y_axis_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		y_axis_path.setAttributeNS(null, "d", "M"+(x_axis_left_point+(x_axis_label_interval_point*i))+" "+y_axis_top_point+" V"+y_axis_bottom_point);
		y_axis_path.setAttributeNS(null, "stroke", "rgba(0, 0, 0, 0.125)");
		y_axis_path.setAttributeNS(null, "stroke-width", "0.5");
		y_axis_path.setAttributeNS(null, "stroke-linecap", "round");
		y_axis_path.setAttributeNS(null, "stroke-opacity", "1");
		horizontal_bar_chart_svg.appendChild(y_axis_path);
	}
	
	//bar math
	var bar_interval = ((y_axis_bottom_point-y_axis_top_point)/(count_array.length*2+(count_array.length-1))); //affects y axis
	var bar_height = bar_interval*2;
	var bar_axis_offset = 0.25;
	var label_axis_offset = 5*bar_axis_offset;
	var bar_label_max_width = (+x_axis_left_point)-(+chart_padding);
	
	var colors_array = select_chart_colors(bar_percentage_array.length);
	
	for (i = 0 ; i < bar_percentage_array.length; i++) {
		var bar_end_point = (bar_percentage_array[i]*(x_axis_right_point-x_axis_left_point));//x axis point
		var chart_path_id = horizontal_bar_chart_svg.getAttribute("id")+"_"+ items_array[i].toLowerCase().replaceAll(" ", "_");
		var x = ((+x_axis_left_point)+bar_axis_offset);
		var y = (((+y_axis_top_point)+bar_axis_offset)+((bar_interval+bar_height)*i));
		
		//create horizontal bar
		var horizontal_bar = document.createElementNS("http://www.w3.org/2000/svg", "path");
		horizontal_bar.setAttributeNS(null, "d", "M"+x+" "+y+" v"+bar_height+" h"+bar_end_point+" v-"+bar_height+" Z");
		horizontal_bar.setAttributeNS(null, "id", chart_path_id);
		horizontal_bar.setAttributeNS(null, "class", horizontal_bar_chart_svg.getAttribute("id"));
		horizontal_bar.setAttributeNS(null, "data-item", items_array[i]);
		horizontal_bar.setAttributeNS(null, "data-count", count_array[i]);
		horizontal_bar.setAttributeNS(null, "data-percentage", Math.round(percentage_array[i]));
		horizontal_bar.setAttributeNS(null, "fill", colors_array[i]);
		horizontal_bar.setAttributeNS(null, "fill-opacity", "1");
		horizontal_bar.setAttributeNS(null, "stroke", "rgb(0, 0, 0)");
		horizontal_bar.setAttributeNS(null, "stroke-width", "0.5");
		horizontal_bar.setAttributeNS(null, "stroke-linejoin", "round");
		horizontal_bar.setAttributeNS(null, "stroke-opacity", "0");
		horizontal_bar.setAttributeNS(null, "onmouseover", "on_hover_over_chart('"+horizontal_bar_chart_svg.getAttribute("id")+"', '"+chart_path_id+"')"); //send chart path classname and path id 
		horizontal_bar.setAttributeNS(null, "onmouseout", "on_hover_off_chart('"+horizontal_bar_chart_svg.getAttribute("id")+"')"); //send chart path classname
		horizontal_bar_chart_svg.appendChild(horizontal_bar);
		
		//create corresponding label
		var horizontal_bar_label = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		horizontal_bar_label.setAttributeNS(null, "x", ((+x_axis_left_point)-(label_axis_offset+bar_label_max_width)));
		horizontal_bar_label.setAttributeNS(null, "y", y);
		horizontal_bar_label.setAttributeNS(null, "width", bar_label_max_width);
		horizontal_bar_label.setAttributeNS(null, "height", bar_height);
		horizontal_bar_chart_svg.appendChild(horizontal_bar_label);
		horizontal_bar_label.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="y_axis_label"><span xmlns="http://www.w3.org/1999/xhtml" class="y_axis_label_span">`+items_array[i]+`</span></div>`;
	}
}