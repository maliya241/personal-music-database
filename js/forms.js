/**************

Executes in form_suggestions function.
**************/
function sort_and_filter_unique_array(array) {
	
}

/**************
form_suggestions creates a datalist and populates the options with items of a given keyname in a given data object.
Executes in song_form.js
**************/
function form_suggestions(data_object, object_keyname) {
	var input_id = object_keyname + "_form";
	var input = document.getElementById(input_id);
	//make datalist
	var input_datalist_id = input_id + "_list";
	var input_datalist = document.createElement("datalist");
	input_datalist.setAttribute("id", input_datalist_id);
	input_datalist.setAttribute("class", input_datalist_id + " datalist song_datalist");
	input.after(input_datalist);
	
	//populate options_array with items from object with its corresponding keyname
	var options_array = [];
	for (i = 0; i < data_object.length; i++) {
		if (Array.isArray(data_object[i][object_keyname])) {
			for (j = 0; j < data_object[i][object_keyname].length; j++) {
				options_array[options_array.length] = data_object[i][object_keyname][j];
			}
		} else {
			options_array[options_array.length] = data_object[i][object_keyname];
		}
	}
	
	//add options from options_array
	for (i = 0; i < options_array.length; i++) {
		var input_datalist_option = document.createElement("option");
		input_datalist_option.setAttribute("value", options_array[i]);
		input_datalist.appendChild(input_datalist_option);
	}
	
	input.setAttribute("list", input_datalist_id);
}

/**************
add_new_field adds another field corresponding with the given classname.
field_classname is the classname of the needed field.
Executes on click.
**************/
function add_new_field(field_classname) {
	var new_field = document.createElement("input");
	new_field.setAttribute('type', 'text');
	var new_id = field_classname + "_" + document.getElementsByClassName(field_classname).length;
	new_field.setAttribute('id', new_id);
	new_field.setAttribute('class', field_classname);
	new_field.setAttribute('name', field_classname);
	new_field.setAttribute('list', field_classname+"_list");
	var field_div = field_classname+"_div";
	document.getElementById(field_div).append(new_field);
}

/**************
field_values_to_string checks if there are more than one elements with the given classname. If there is, then it returns the values in a string that is formatted like an array. If not, it returns the value of the one element.
field_classname is a classname.
Executes in add_song function.
Returns a string.
**************/
function field_values_to_string(field_classname) {
	var field_classname_elements = document.getElementsByClassName(field_classname);
	
	var field_value_string = "'"+field_classname_elements[0].value+"'"; //get first value
	
	if (field_classname_elements.length > 1) { //if more than one value, make add other value(s) to string and format string to look like an array
		for (i = 1; i < field_classname_elements.length; i++) { //already added first value
			if (field_classname_elements[i].value.length > 0) { //checks value is not empty
				field_value_string += ", '"+field_classname_elements[i].value+"'";
			}
		}
		if (field_value_string.length > (field_classname_elements[0].value.length+2)) { //checks for more than one value has been added to string
			field_value_string = "["+field_value_string+"]";
		}
	} 
	return field_value_string; 
}