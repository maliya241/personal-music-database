/**************

Executes in form_suggestions function.
Return sorted array.
**************/
function sort_array(array) {
	var i, switching, should_switch;
	switching = true;
	//Make a loop that will continue until no switching has been done:
	while (switching) {
		switching = false; //start by saying no switching is done
		for (i = 0; i < (array.length-1); i++) {
			should_switch = false; //start by saying there should be no switching
			if (array[i].toLowerCase() > array[i+1].toLowerCase()) { //check if the next item should switch place with the current item
				//if next item is alphabeticallylower than current item, mark as a switch and break the loop
				should_switch = true;
				break;
			}
		}
		if (should_switch) {
			//if a switch has been marked, make the switch and mark the switch as done
			var array_first_item_switch = array[i];
			array[i] = array[i+1];
			array[i+1] = array_first_item_switch;
			switching = true;
		} 

		
	}
	return array;
}

/**************

Executes in form_suggestions function.
Return array of unique items.
**************/
function filter_unique_array(array) {
	var filtered_array = [];
	for (i = 0; i < (array.length-1); i++) {
		
	} 
	return filtered_array;
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
	
	options_array = sort_array(options_array);
	
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