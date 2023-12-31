
document.getElementById("nav").innerHTML = `<a href="`+get_full_relative_path(page_directory_object_array, "index.html")+`" tabindex="0">Home</a>
	<div class="nav_dropdown">
		<button type="button" class="nav_dropdown_button" tabindex="0" onclick="toggle_dropdown_display('nav_dropdown_songs')"><a href="songs.html" tabindex="0">Songs</a></button>
		<div id="nav_dropdown_songs" class="nav_dropdown_content">
			<a href="`+get_full_relative_path(page_directory_object_array, "song_form.html")+`" tabindex="0">Song Form</a>
			<a href="`+get_full_relative_path(page_directory_object_array, "songs_table.html")+`" tabindex="0">Songs Table</a>
		</div>
	</div>`;

	
		
document.getElementById("footer").innerHTML = ``;

/**************
toggle_dropdown_display function changes the display style of a dropdown contents based on previous display style when dropdown button has been clicked.
dropdown_content_id parameter is the id of a div of contents for a dropdown.
Executes when a dropdown button is clicked.
**************/
function toggle_dropdown_display(dropdown_content_id) {
	if (document.getElementById(dropdown_content_id).style.display == "none") {
		document.getElementById(dropdown_content_id).style.display = 'block';
	} else {
		document.getElementById(dropdown_content_id).style.display = 'none';
	}
}