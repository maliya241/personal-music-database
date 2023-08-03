/**************
get_page_file_name function gets the current page's file name.
Executes in get_relative_path function.
Returns a string of the current page's file name.
**************/
function get_page_file_name() {
	 return window.location.pathname.replaceAll(/.*\//g, "");
}

/**************
get_partial_page_path_from_file_name function gets the partial page path from a given file name that is stored in a given page directory.
directory_object_array parameter is the object array to reference for page directory.
file_name parameter is a string of the page file name.
Executes in get_relative_path function.
Returns the value of the page path from a given page directory object array.
**************/
function get_partial_page_path_from_file_name(directory_object_array, file_name) {
	var page_partial_path_value = null;
	for (i = 0; i < directory_object_array.length; i++) {
		if (directory_object_array[i].page_file_name === file_name) {
			page_partial_path_value = directory_object_array[i].page_partial_path;
		}
	}
	return page_partial_path_value;
}

/**************
get_partial_page_path_from_title function gets the partial page path from a given page title that is stored in a given page directory.
directory_object_array parameter is the object array to reference for page directory.
title parameter is a string of the page title.
Executes in get_relative_path function.
Returns the value of the page path from a given page directory object array.
**************/
function get_partial_page_path_from_page_title(directory_object_array, title) {
	var page_partial_path_value = null;
	for (i = 0; i < directory_object_array.length; i++) {
		if (directory_object_array[i].page_title === title) {
			page_partial_path_value = directory_object_array[i].page_partial_path;
		}
	}
	return page_partial_path_value;
}

/**************
get_full_relative_path function gets the relative page path from the current page file name to a given destination file name that is stored in a given page directory.
directory_object_array parameter is the object array to reference for page directory.
destination_file_name parameter is a string of the destination page file name.
Executes in nav_and_footer.js
Returns a string of the relative page path.
**************/
function get_full_relative_path(directory_object_array, destination_file_name) {
	var relative_path = null;
	var current_file_name = get_page_file_name();
	if (current_file_name !== destination_file_name) {
		var current_page_partial_path = get_partial_page_path_from_file_name(directory_object_array, current_file_name);
		var destination_page_partial_path = get_partial_page_path_from_file_name(directory_object_array, destination_file_name);
		relative_path = current_page_partial_path.replaceAll(/.[^\/]*\//g, "../")+destination_page_partial_path+destination_file_name;
	} else {
		relative_path = current_file_name;
	}
	return relative_path;
}