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

