/**************
populate_table_from_data_object function creates html a table row for all items in data js files.  
Executes as a part of page set-up in its corresponding page js file.
**************/
function populate_table_from_data_object(data_object) {
	var table_body = document.getElementsByTagName("tbody")[0];
	var data_object_keynames = Object.keys(data_object[0]);
	for (i = 0; i < data_object.length; i++) { //iterates through the data object
		var new_tr = table_body.appendChild(document.createElement("tr"));
		new_tr.setAttribute("id", data_object[i][data_object_keynames[0]].toLowerCase().replaceAll(" ", "_"));
		for (j = 0; j < data_object_keynames.length; j++) { //iterates through the properties of the data object
			if (Array.isArray(data_object[i][data_object_keynames[j]])) { //moves nonempty items into a copy of array and formats copy for readabiliy  
				new_tr.innerHTML += `<td class="`+data_object_keynames[j]+`">`+data_object[i][data_object_keynames[j]].filter(item => item.length > 0).join(", ")+`</td>`;
			} else {
				new_tr.innerHTML += `<td class="`+data_object_keynames[j]+`">`+data_object[i][data_object_keynames[j]]+`</td>`;
			}
		}
	}

}

/**************
populate_table_from_array_of_arrays function creates html a table row for all items in given array of arrays. 
array_of_arrays contains arrays with table data. Each array contains data of a single column. 
table_id is a string of the id of the table to be populated.
Executes as a part of page set-up in its corresponding page js file.
**************/
function populate_table_from_array_of_arrays(array_of_arrays, table_id) {
	var id_of_table_body = table_id + "_body";
	var table_th = document.getElementById(table_id).getElementsByTagName("th");
	for (i = 0; i < array_of_arrays[0].length; i++) { //iterates through the array in the array of arrays; each array in the array of arrays should be the same length; table rows
		var new_tr = document.getElementById(id_of_table_body).appendChild(document.createElement("tr"));
		new_tr.setAttribute("id", array_of_arrays[0][i].toLowerCase().replaceAll(" ", "_")); 
		for (j = 0; j < array_of_arrays.length; j++) { //iterates through the array of arrays; table columns
			var td_classname = table_id + "_" + table_th[j].innerText.toLowerCase().replaceAll(' ', '_');
			new_tr.innerHTML += `<td class="`+td_classname+`">`+array_of_arrays[j][i]+`</td>`;
		}
	}

}

/**************
populate_table_from_array_of_arrays_with_object_array function creates html a table row for all items in given array of arrays. 
array_of_arrays contains arrays with table data. Each array contains data of a single column. First element contains array of objects.
table_id is a string of the id of the table to be populated.
Executes as a part of page set-up in its corresponding page js file.
**************/
function populate_table_from_array_of_arrays_with_object_array(array_of_arrays, table_id) {
	var id_of_table_body = table_id + "_body";
	var table_th = document.getElementById(table_id).getElementsByTagName("th");
	for (i = 0; i < array_of_arrays[0].length; i++) { //iterates through the array in the array of arrays; each array in the array of arrays should be the same length; table rows
		var new_tr = document.getElementById(id_of_table_body).appendChild(document.createElement("tr"));
		new_tr.setAttribute("id", Object.values(array_of_arrays[0][i]).join("_").toLowerCase().replaceAll(" ", "_")); 
		var table_column = 0;
		for (j = 0; j < array_of_arrays.length; j++) { //iterates through the array of arrays; table columns
			if (typeof(array_of_arrays[j][i]) === "object") {
				var object_keynames_array = Object.keys(array_of_arrays[j][i]);
				for (k = 0; k < object_keynames_array.length; k++) { //iterate through object; k represents the index of the object property names
					var td_classname = table_id + "_" + table_th[table_column].innerText.toLowerCase().replaceAll(' ', '_');
					new_tr.innerHTML += `<td class="`+td_classname+`">`+array_of_arrays[j][i][object_keynames_array[k]]+`</td>`;
					table_column++;
				}
			} else {
				var td_classname = table_id + "_" + table_th[table_column].innerText.toLowerCase().replaceAll(' ', '_');
				new_tr.innerHTML += `<td class="`+td_classname+`">`+array_of_arrays[j][i]+`</td>`;
				table_column++;
			}
		}
	}
}

/**************
search_items_table function searchs all items on page and hides all items that do not have the search term in its <tr> tag contents. It does not account for misspellings or variations of keyword order.
Executes on key up in search bar.
**************/
function search_items_table() {
	// Declare variables
	var input, filter, div, tr, i, text_value;
	input = document.getElementById('search_input');
	filter = input.value.toUpperCase();
	tr = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
	// Loop through all tbody table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		text_value = tr[i].textContent || tr[i].innerText;
		if (text_value.toUpperCase().indexOf(filter) > -1) {
			tr[i].style.display = "";
		} else {
			tr[i].style.display = "none";
		}
	}
}

/**************
toggle_hide function hides all elements with its given classname and turns its corresponging button grey when the button is pressed; default display is visible.
toggle_classname parameter: takes a string argument, needs to be the classname of the elements that needs is display toggled.
Executes on button click.
**************/
function toggle_hide(toggle_classname) {
	var elements_to_hide = document.getElementsByClassName(toggle_classname);
	var toggle_button_id = "toggle_hide_button_"+toggle_classname;
	var toggle_button = document.getElementById(toggle_button_id);
	for (i = 0; i < elements_to_hide.length; i++ ) {
		if (elements_to_hide[i].style.display === "none") { 
			elements_to_hide[i].style.display = ""; 
			toggle_button.style.background = "#2196F3";
		} else {
			elements_to_hide[i].style.display = "none"; 
			toggle_button.style.background = "#ccc";
		}
	}
}

/**************
sort_table sorts a given table body by a selected column (indicated by given classname). Duplicate data in the selected column will hold the previous table row position when compared to each other.
table_body_id parameter is id of the table body to be sorted.
table_classname parameter indicates which column of data is used to sort the table body.
Executes on click.
**************/
function sort_table(table_body_id, table_classname) {
	var table_body, rows, switching, i, x, y, should_switch, sort_direction, switch_count = 0;
	table_body = document.getElementById(table_body_id);
	switching = true;
	sort_direction = "asc"; //set the sorting direction to ascending
	while (switching) { //make a loop that will continue until no switching has been done
		switching = false;
		rows = table_body.rows;
		for (i = 0; i < rows.length - 1; i++) { //loop through all table body rows
			should_switch = false; //start by saying there should be no switching
			x = rows[i].getElementsByClassName(table_classname)[0]; //first element to compare
			y = rows[i+1].getElementsByClassName(table_classname)[0]; //next element to compare
			
			/*check if the two rows should switch place, based on the direction, asc or desc*/
			if (sort_direction == "asc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) { //if so, mark as a switch and break the loop
					should_switch = true;
					break;
				}
			} else if (sort_direction == "desc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) { //if so, mark as a switch and break the loop
					should_switch = true;
					break;
				}
			}
		}
		if (should_switch) {
			/*if a switch has been marked, make the switch and mark that a switch has been done*/
			rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
			switching = true;
			switch_count++; //each time a switch is done, increase this count by 1	
		} else {
			/*If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.*/
			if (switch_count == 0 && sort_direction == "asc") {
				sort_direction = "desc";
				switching = true;
			}
		}
	}
}
