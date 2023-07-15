/**************
populate_table function creates html a table row for all items in data js files.
Executes as a part of page set-up in its corresponding page js file..
**************/
function populate_table(data_object) {
	var id_of_table = document.getElementsByTagName("tbody")[0];
	var data_object_keynames = Object.keys(data_object[0]);
	for (i = 0; i < data_object.length; i++) { //iterates through the data object
		var new_tr = id_of_table.appendChild(document.createElement("tr"));
		for (j = 0; j < data_object_keynames.length; j++) { //iterates through the properties of the data objecct
			new_tr.innerHTML += `<td class="`+data_object_keynames[j]+`">`+data_object[i][data_object_keynames[j]]+`</td>`;
		}
	}

}

/**************
search_items function searchs all items on page and hides all items that do not have the search term in its <tr> tag contents. It does not account for misspellings or variations of keyword order.
Executes on key up in search bar.
**************/
function search_items() {
	// Declare variables
	var input, filter, div, tr, i, text_value;
	input = document.getElementById('search_input');
	filter = input.value.toUpperCase();
	tr = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
	// Loop through all tbody table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		text_value = tr[i].textContent || tr[i].innerText;
		console.log(text_value);
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
	var table_column = document.getElementsByClassName(toggle_classname);
	var toggle_button_id = "toggle_hide_button_"+toggle_classname;
	var toggle_button = document.getElementById(toggle_button_id);
	for (i = 0; i < table_column.length; i++ ) {
		if (table_column[i].style.display === "none") { 
			table_column[i].style.display = ""; 
			toggle_button.style.background = "#2196F3";
		} else {
			table_column[i].style.display = "none"; 
			toggle_button.style.background = "#ccc";
		}
	}
}

/**************
sort_table sorts a given table by a selected column (indicated by given classname). Duplicate data in the selected column will hold the previous table row position when compared to each other.
table_id parameter is id of the table to be sorted.
table_classname parameter indicates which column of data is used to sort the table.
Executes on click.
**************/
function sort_table(table_id, table_classname) {
	var table, rows, switching, i, x, y, should_switch, sort_direction, switch_count = 0;
	table = document.getElementById(table_id);
	table_head_classname = table.rows[0].getElementsByClassName(table_classname)[0];
	switching = true;
	sort_direction = "asc"; //set the sorting direction to ascending
	while (switching) { //make a loop that will continue until no switching has been done
		switching = false;
		rows = table.rows;
		for (i = 1; i < rows.length - 1; i++) { //loop through all table rows (except the first, which contains table headers)
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
