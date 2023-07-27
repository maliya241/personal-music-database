
add_color_selectors_html_elements("year_released_artist_timeline_chart_color_selectors", "song_year_released_artist_timeline", "year_released_artist_timeline_chart");

const song_year_released_artist_array_of_objects = [];
for (i = 0; i < songs_object.length; i++) {
	const date = new Date(songs_object[i].song_date_released);
	song_year_released_artist_array_of_objects[song_year_released_artist_array_of_objects.length] = {
		artist: songs_object[i].song_artist,
		year_released: date.getFullYear().toString()
	}
}

var object_keynames_array = ["year_released", "artist"];
var unique_years_released_artists_and_count_array = sort_filter_and_count_unique_array_of_objects(song_year_released_artist_array_of_objects, object_keynames_array);
console.log(unique_years_released_artists_and_count_array);
var max_count = unique_years_released_artists_and_count_array.pop();

// populate_table_from_array_of_arrays(unique_years_released_and_count_array, "song_year_released_artist_timeline_table");

// create_horizontal_bar_chart("year_released_artist_horizontal_bar_chart", unique_years_released_artists_and_count_array, max_count);