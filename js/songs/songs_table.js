populate_table_from_data_object(songs_object);

var table_body_id = "songs_table_body";

var table_song_title = document.getElementById(table_body_id).getElementsByClassName("song_title");
var table_song_album = document.getElementById(table_body_id).getElementsByClassName("song_album");
var table_song_date_released = document.getElementById(table_body_id).getElementsByClassName("song_date_released");
var month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var table_song_explicit = document.getElementById(table_body_id).getElementsByClassName("song_explicit");
for (i = 0; i < table_song_title.length; i++) {
	table_song_title[i].innerText = '"'+table_song_title[i].innerText+'"';
	
	table_song_album[i].style.fontStyle = "italic";
	
	const date = new Date(table_song_date_released[i].innerText);
	table_song_date_released[i].innerText = (date.getDate()+1).toString()+" "+month_name[date.getMonth()]+" "+date.getFullYear().toString(); //getDate result is off by one without timestamp so add one to correct it
	
	if (table_song_explicit[i].innerText === "true") {
		table_song_explicit[i].innerText = "yes";
	} else {
		table_song_explicit[i].innerText = "no";
	}
}