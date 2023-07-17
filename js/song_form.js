/**************
add_song creates a code block of a song object with information given in the form. 
Executes on click.
**************/
function add_song() {	
	var warnings = document.getElementsByClassName("validation_warning");
	for (i = warnings.length; i > 0; i--) { //remove all previous warnings
		warnings[i-1].remove();
	}
	
	if (form_validation()) {
		
		const song_artist_data = field_values_to_string("song_artist_form");
		const song_language_data = field_values_to_string("song_language_form");
		const song_genre_data = field_values_to_string("song_genre_form");
		const song_theme_data = field_values_to_string("song_theme_form");
		
		
		// Creates a code block of song object to be copied into songs.js
		// Changing format for the following block of code will affect its format on page.
		document.getElementById("song_data_object").innerHTML += `songs_object[songs_object.length] = {
	song_title:"`+document.getElementById("song_title_form").value+`",
	song_album:'`+document.getElementById("song_album_form").value+`',
	song_artist:`+song_artist_data+`,
	song_duration:'`+document.getElementById("song_duration_form").value+`',
	song_date_released:'`+document.getElementById("song_date_released_form").value+`',
	song_language:`+song_language_data+`,
	song_explicit:`+document.getElementById("song_explicit_form").checked+`,
	song_genre:`+song_genre_data+`,
	song_theme:`+song_theme_data+`,
	song_discovered_how:'`+document.getElementById("song_discovered_how_form").value+`',
	song_year_discovered:'`+document.getElementById("song_year_discovered_form").value+`',
}

`;
	} else {
		var warning = document.createElement("p");
		warning.setAttribute('class', 'song_validation_warning validation_warning');
		warning.innerText = "*Missing or invalid data has been entered.";
		document.getElementById("add_song_button").after(warning);
	}
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

/**************
copy_code_block copies text from element selected by a given id. If element is a <pre> tag, it will copy the format the text has.
id_of_text_to_be_copied is the id of the element with the text to be copied.
Executes on click of Copy Code Block button.
**************/
function copy_code_block(id_of_text_to_be_copied) {
	var copy_text = document.getElementById(id_of_text_to_be_copied).innerText;
	
	navigator.clipboard.writeText(copy_text); //copy the text
}

/**************
duration_form_validation checks if duration input matches one of the acceptable  patterns or is empty. If it matches an acceptable pattern, it will correct input to preferred format (mm:ss) and return true. If not, add p element with warning and return false.
Executes in form_validation function.
Returns boolean.
**************/
function duration_form_validation(form_input_element_id) {
	var input_element = document.getElementById(form_input_element_id);
			
	if (input_element.value.length === 0) { //accept if empty
		return true;
	} else if (/^[0-9][0-5][0-9]$/.test(input_element.value)) { //accept if pattern matches three digits (mss)
		input_element.value = input_element.value.replace(/^/,'0').replace(/(.{2})$/,':$1'); //adds leading zero and colon
		return true;
	} else if (/^(0[0-9]|[0-5][0-9])[0-5][0-9]$/.test(input_element.value)) { //accept if pattern matches four digits (mmss)
		input_element.value = input_element.value.replace(/(.{2})$/,':$1'); //adds colon
		return true;
	} else if (/^[0-9]:[0-5][0-9]$/.test(input_element.value)) { //accept if pattern matches three digits and colon (m:ss)
		input_element.value = input_element.value.replace(/^/,'0'); //adds leading zero
		return true;
	} else if (/^(0[0-9]|[0-5][0-9]):[0-5][0-9]$/.test(input_element.value)) { //accept if pattern matches four digits and colon (mm:ss)
		return true;
	} else {
		var warning = document.createElement("p"); //create warning element
		warning.setAttribute('class', 'year_validation_warning validation_warning');
		warning.innerText = "*Needs follow pattern of mm:ss.";
		input_element.after(warning);
		return false;
	}
}

/**************
multiple_input_form_validation
Executes in form_validation function.
Returns boolean.
**************/
function multiple_input_form_validation(form_input_element_classname) {
	var input_element = document.getElementsByClassName(form_input_element_classname);
	var last_input_element_id = form_input_element_classname + "_" + (document.getElementsByClassName(form_input_element_classname).length-1);
	
	var warning = document.createElement("p"); //create warning element
	warning.setAttribute('class', 'year_validation_warning validation_warning');
	warning.innerText = "*First input cannot be blank.";
			
	if (input_element.length == 1 || (input_element.length > 1 && input_element[0].value.length > 0)) { //accept if there is only one input or if more than one input and first input element is not empty
		return true;
	} else if (input_element.length > 1) { //accept if more than input
		for (i = 0; i < input_element.length; i++) {
			if (input_element[i].value.length > 0) { //checks that input is not empty
				document.getElementById(last_input_element_id).after(warning);
				return false;
			}
		}
		return true;
	} else {
		document.getElementById(last_input_element_id).after(warning);
		return false;
	}
}

/**************
year_form_validation checks if year input matches the pattern or is empty. If not, add p element with warning and return false.
Executes in form_validation function.
Returns boolean.
**************/
function year_form_validation(form_input_element_id) {
	var input_element = document.getElementById(form_input_element_id);
			
	if ( /[0-9]{4}/.test(input_element.value) || input_element.value.length === 0) { //has to match pattern of 4 digits or be empty
		return true;
	} else {
		var warning = document.createElement("p"); //create warning element
		warning.setAttribute('class', 'year_validation_warning validation_warning');
		warning.innerText = "*Needs to be a 4 digit integer.";
		input_element.after(warning);
		return false;
	}
}

/**************
form_validation executes other validations functions and returns the result.
Executes in add_song function.
Returns boolean.
**************/
function form_validation() {
	var duration_validation_bool = duration_form_validation("song_duration_form");
	var year_validation_bool = year_form_validation("song_year_discovered_form");
	var artist_validation_bool = multiple_input_form_validation("song_artist_form");
	var language_validation_bool = multiple_input_form_validation("song_language_form");
	var genre_validation_bool = multiple_input_form_validation("song_genre_form");
	var theme_validation_bool = multiple_input_form_validation("song_theme_form");
	
	if (duration_validation_bool && year_validation_bool && artist_validation_bool && language_validation_bool && genre_validation_bool && theme_validation_bool) { //all conditions must be true to proceed
		return true;
	} else {
		return false;
	}
		
}