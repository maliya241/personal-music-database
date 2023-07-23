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
