/**************
get_rgb_values takes a string of rgb or rgba property and returns an array of the values.
rgb_string parameter is a string that contains the rgb or rgba property 
Executes in change_color_slider function and change_color_text_input function.
Returns array rgb or rgba values with the position of the values correspond to the acronym.
**************/
function get_rgb_values(rgb_string) {
	var rgb_array = [];
	var rgb_string_array = rgb_string.split(", ");
	for (i = 0; i < rgb_string_array.length; i++) {
		rgb_array[i] = rgb_string_array[i].match(/\d+/)[0];
	}
	return rgb_array;
}

/**************
change_color_slider gets the value from the range input in the given div, assigns that value to its corresponding text input, and calls change_color functions with color_div_id and input_value as its arguments.
color_div_id parameter is the id of the div that contains the color select elements.
chart_classname 
Executes on click.
**************/
function change_color_slider(color_div_id, chart_classname) {
	var input_value = document.getElementById(color_div_id+"_slider").value;
	document.getElementById(color_div_id+"_text_input").value = input_value;
	
	change_color(color_div_id, chart_classname, input_value);
}

/**************
change_color_text_input gets the value from the range input in the given div, assigns that value to its corresponding range input, and calls change_color functions with color_div_id and input_value as its arguments.
color_div_id parameter is the id of the div that contains the color select elements.
chart_classname
Executes on click.
**************/
function change_color_text_input(color_div_id, chart_classname) {
	var input_value = document.getElementById(color_div_id+"_text_input").value;
	document.getElementById(color_div_id+"_slider").value = input_value;
	
	change_color(color_div_id, chart_classname, input_value);	
}


/**************
change_color changes the background-color of a given div with the new value and changes the given chart colors.
color_div_id parameter is the id of the div that contains the color select elements.
chart_classname parameter is the given chart that needs colors changed.
input_value is the value from input.
Executes in change_color_slider and change_color_text_input functions.
**************/
function change_color(color_div_id, chart_classname, input_value) {
	var input_number = color_div_id.match(/_[0-9]*$/)[0];
	var color_selector = document.getElementById("color_selector"+input_number);
	
	var previous_rgba_values = get_rgb_values(window.getComputedStyle(color_selector).getPropertyValue("background-color")); //get previous values
	
	if (/_r/.test(color_div_id)) { //changes r value
		color_selector.style.setProperty("background-color", "rgb("+input_value+", "+previous_rgba_values[1]+", "+previous_rgba_values[2]+")");
	} else if (/_g/.test(color_div_id)) { //changes g value
		color_selector.style.setProperty("background-color", "rgb("+previous_rgba_values[0]+", "+input_value+", "+previous_rgba_values[2]+")");
	} else if (/_b/.test(color_div_id)) { //changes b value
		color_selector.style.setProperty("background-color", "rgb("+previous_rgba_values[0]+", "+previous_rgba_values[1]+", "+input_value+")");
	}
	
	var chart = document.getElementsByClassName(chart_classname);
	var colors_array = select_chart_colors(chart.length);
	for (i = 0; i < chart.length; i++) {
		chart[i].setAttributeNS(null, "stroke", colors_array[i]);
	}
}

/**************
get_shade_value calculates the value of a given current value needed to shade the color.
current_value parameter is one value of the current rgb.
shade_factor_denominator parameter affects the darkness of the color value; cannot be 0; larger value calculates tint value to be greater
Executes in select_chart_colors function.
**************/
function get_shade_value(current_value, shade_factor_denominator) {
	return current_value*(1-(1/shade_factor_denominator)); //current_value * (1 - shade_factor)
}

/**************
get_tint_value calculates the value of a given current value needed to tint the color.
current_value parameter is one value of the current rgb; string needs to be converted to number type
tint_factor_denominator parameter is how much white is added to the color; cannot be 0; larger value calculates tint value to be smaller
Executes in select_chart_colors function.
**************/
function get_tint_value(current_value, tint_factor_denominator) {
	return (+current_value)+((255-current_value)*(1/tint_factor_denominator)); //current_value + (255 - current_value) * tint_factor
}


/**************
select_chart_colors selects a given number of shades and tints from an array of rgb values.
number_of_colors parameter is the number of colors to be selected.
Executes in create_pie_chart funciton and change_color function.
Returns array of colors.
**************/
function select_chart_colors(number_of_colors) {
	var selected_colors = [];
	var input_color_elements = document.getElementsByClassName("color_text_input");
	for (i = 1; i <= number_of_colors; i++) { //iterate through number of colors
		var color_option = (i%(input_color_elements.length/3))*3; //alternate color options
		var current_r = input_color_elements[color_option].value;
		var current_g = input_color_elements[color_option+1].value;
		var current_b = input_color_elements[color_option+2].value;
		
		var alpha_factor_denominator = i+2;
		if (i%2 === 0) {
			selected_colors[i-1] = "rgba("+get_shade_value(current_r, alpha_factor_denominator)+", "+get_shade_value(current_g, alpha_factor_denominator)+", "+get_shade_value(current_b, alpha_factor_denominator)+", 1.0)";
		} else {
			selected_colors[i-1] =  "rgba("+get_tint_value(current_r, alpha_factor_denominator)+", "+get_tint_value(current_g, alpha_factor_denominator)+", "+get_tint_value(current_b, alpha_factor_denominator)+", 1.0)";
		}
	}
	return selected_colors;
}

/**************
add_color add html for color_selector in the div of a given id. 
color_selectors_div_id parameter is the id of a div for color selectors.
chart_classname parameter is the id of the chart that needs a color added.
Executes on click;

Warning: Does not apply css yet.
**************/
function add_color(color_selectors_div_id, chart_classname) {
	var color_selectors_div = document.getElementById(color_selectors_div_id);
	var color_selector_index = color_selectors_div.getElementsByClassName("color_selector").length;
	
	//create div to contain everything for new color form
	var color_selector_div = document.createElement("div");
	color_selector_div.setAttribute("id", "color_selector_"+color_selector_index);
	color_selector_div.setAttribute("class", "color_selector");
	color_selectors_div.insertBefore(color_selector_div, document.getElementById("add_color_button"));
	
	//create color swatch div
	var color_swatch = document.createElement("div");
	color_swatch.setAttribute("class", "color_swatch");
	color_selector_div.appendChild(color_swatch);
	
	//create r form div
	var color_r_div = document.createElement("div");
	color_r_div.setAttribute("id", "color_r_"+color_selector_index);
	color_r_div.setAttribute("class", "color_r");
	color_selector_div.appendChild(color_r_div);
	
	//create r form label
	var color_r_label = document.createElement("label");
	color_r_label.setAttribute("for", "color_r_"+color_selector_index+"_text_input");
	color_r_label.innerText = "R";
	color_r_div.appendChild(color_r_label);
	
	//create r form text input
	var color_r_text_input = document.createElement("input");
	color_r_text_input.setAttribute("type", "text");
	color_r_text_input.setAttribute("name", "color_r_"+color_selector_index+"_text_input");
	color_r_text_input.setAttribute("id", "color_r_"+color_selector_index+"_text_input");
	color_r_text_input.setAttribute("class", "color_text_input");
	color_r_text_input.setAttribute("min", "0");
	color_r_text_input.setAttribute("max", "255");
	color_r_text_input.setAttribute("size", "3");
	color_r_text_input.setAttribute("oninput", "change_color_text_input('color_r_"+color_selector_index+"', '"+chart_classname+"')");
	color_r_text_input.setAttribute("onchange", "change_color_text_input('color_r_"+color_selector_index+"', '"+chart_classname+"')");
	var random_r_value = Math.floor(Math.random() * 255);
	color_r_text_input.setAttribute("value", random_r_value);
	color_r_div.appendChild(color_r_text_input);
	
	//create r form range input
	var color_r_slider = document.createElement("input");
	color_r_slider.setAttribute("type", "range");
	color_r_slider.setAttribute("name", "color_r_"+color_selector_index+"_slider");
	color_r_slider.setAttribute("id", "color_r_"+color_selector_index+"_slider");
	color_r_slider.setAttribute("class", "color_slider");
	color_r_slider.setAttribute("min", "0");
	color_r_slider.setAttribute("max", "255");
	color_r_slider.setAttribute("onchange", "change_color_slider('color_r_"+color_selector_index+"', '"+chart_classname+"')");
	color_r_text_input.setAttribute("value", random_r_value);
	color_r_div.appendChild(color_r_slider);
	
	//create g form div
	var color_g_div = document.createElement("div");
	color_g_div.setAttribute("id", "color_g_"+color_selector_index);
	color_g_div.setAttribute("class", "color_g");
	color_selector_div.appendChild(color_g_div);
	
	//create g form label
	var color_g_label = document.createElement("label");
	color_g_label.setAttribute("for", "color_g_"+color_selector_index+"_text_input");
	color_g_label.innerText = "G";
	color_g_div.appendChild(color_g_label);
	
	//create g form text input
	var color_g_text_input = document.createElement("input");
	color_g_text_input.setAttribute("type", "text");
	color_g_text_input.setAttribute("name", "color_g_"+color_selector_index+"_text_input");
	color_g_text_input.setAttribute("id", "color_g_"+color_selector_index+"_text_input");
	color_g_text_input.setAttribute("class", "color_text_input");
	color_g_text_input.setAttribute("min", "0");
	color_g_text_input.setAttribute("max", "255");
	color_g_text_input.setAttribute("size", "3");
	color_g_text_input.setAttribute("oninput", "change_color_text_input('color_g_"+color_selector_index+"', '"+chart_classname+"')");
	color_g_text_input.setAttribute("onchange", "change_color_text_input('color_g_"+color_selector_index+"', '"+chart_classname+"')");
	var random_g_value = Math.floor(Math.random() * 255);
	color_g_text_input.setAttribute("value", random_g_value);
	color_g_div.appendChild(color_g_text_input);
	
	//create g form range input
	var color_g_slider = document.createElement("input");
	color_g_slider.setAttribute("type", "range");
	color_g_slider.setAttribute("name", "color_g_"+color_selector_index+"_slider");
	color_g_slider.setAttribute("id", "color_g_"+color_selector_index+"_slider");
	color_g_slider.setAttribute("class", "color_slider");
	color_g_slider.setAttribute("min", "0");
	color_g_slider.setAttribute("max", "255");
	color_g_slider.setAttribute("onchange", "change_color_slider('color_g_"+color_selector_index+"', '"+chart_classname+"')");
	color_g_text_input.setAttribute("value", random_g_value);
	color_g_div.appendChild(color_g_slider);
	
	//create b form div
	var color_b_div = document.createElement("div");
	color_b_div.setAttribute("id", "color_b_"+color_selector_index);
	color_b_div.setAttribute("class", "color_b");
	color_selector_div.appendChild(color_b_div);
	
	//create b form label
	var color_b_label = document.createElement("label");
	color_b_label.setAttribute("for", "color_b_"+color_selector_index+"_text_input");
	color_b_label.innerText = "B";
	color_b_div.appendChild(color_b_label);
	
	//create b form text input
	var color_b_text_input = document.createElement("input");
	color_b_text_input.setAttribute("type", "text");
	color_b_text_input.setAttribute("name", "color_b_"+color_selector_index+"_text_input");
	color_b_text_input.setAttribute("id", "color_b_"+color_selector_index+"_text_input");
	color_b_text_input.setAttribute("class", "color_text_input");
	color_b_text_input.setAttribute("min", "0");
	color_b_text_input.setAttribute("max", "255");
	color_b_text_input.setAttribute("size", "3");
	color_b_text_input.setAttribute("oninput", "change_color_text_input('color_b_"+color_selector_index+"', '"+chart_classname+"')");
	color_b_text_input.setAttribute("onchange", "change_color_text_input('color_b_"+color_selector_index+"', '"+chart_classname+"')");
	var random_b_value = Math.floor(Math.random() * 255);
	color_b_text_input.setAttribute("value", random_b_value);
	color_b_div.appendChild(color_b_text_input);
	
	//create b form range input
	var color_b_slider = document.createElement("input");
	color_b_slider.setAttribute("type", "range");
	color_b_slider.setAttribute("name", "color_b_"+color_selector_index+"_slider");
	color_b_slider.setAttribute("id", "color_b_"+color_selector_index+"_slider");
	color_b_slider.setAttribute("class", "color_slider");
	color_b_slider.setAttribute("min", "0");
	color_b_slider.setAttribute("max", "255");
	color_b_slider.setAttribute("onchange", "change_color_slider('color_b_"+color_selector_index+"', '"+chart_classname+"')");
	color_b_text_input.setAttribute("value", random_b_value);
	color_b_div.appendChild(color_b_slider);
	
	//create remove color button
	var remove_color_button = document.createElement("button");
	remove_color_button.setAttribute("type", "button");
	remove_color_button.setAttribute("id", "remove_color_button_"+color_selector_index);
	remove_color_button.setAttribute("class", "remove_color_button");
	remove_color_button.setAttribute("onclick", "remove_color('color_selector_"+color_selector_index+"', '"+chart_classname+"')");
	remove_color_button.innerText = "Remove Color";
	color_selector_div.appendChild(remove_color_button);
	
}

/**************
remove_color removes html for color_selector div of a given id. 
color_selectors_div_id parameter is the id of a div for color selectors.
Executes on click;
**************/
function remove_color(color_selector_div_id) {
	document.getElementById(color_selector_div_id).remove();
}