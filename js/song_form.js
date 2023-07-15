/**************
add_song creates a code block of a song object with information given in the form. 
Executes on click.
**************/
function add_song() {	
	const song_artist_data = field_values_to_string("song_artist_form");
	const song_language_data = field_values_to_string("song_language_form");
	const song_genre_data = field_values_to_string("song_genre_form");
	const song_theme_data = field_values_to_string("song_theme_form");
	
	
	// Creates a code block of song object to be copied into songs.js
	document.getElementById("song_data_object").innerHTML += `songs_object[songs_object.length] = {
	song_picture_href:'',
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
			field_value_string += ", '"+field_classname_elements[i].value+"'";
		}
		field_value_string = "["+field_value_string+"]";
	} 
	return field_value_string; 
}

/**************
copy_code_block copies text from element selected by a given id. If element is a <pre> tag, it will copy the format the text has.
id_of_text_to_be_copied is the id of the element with the text to be copied.
Executes on click.
**************/
function copy_code_block(id_of_text_to_be_copied) {
	var copy_text = document.getElementById(id_of_text_to_be_copied).innerText;
	
	navigator.clipboard.writeText(copy_text); //copy the text
}

