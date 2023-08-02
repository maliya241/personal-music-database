
add_color_selectors_html_elements("year_released_artist_timeline_horizontal_bar_chart_color_selectors", "song_year_released_artist_timeline", "year_released_artist_timeline_horizontal_bar_chart");

const song_expanded_multiple_properties_object_array = get_and_expand_multiple_property_values(songs_object, ['song_artist', 'song_date_released']);

const song_year_released_artist_array_of_objects = [];
for (i = 0; i < song_expanded_multiple_properties_object_array.length; i++) {
	const date = new Date(song_expanded_multiple_properties_object_array[i].song_date_released);
	song_year_released_artist_array_of_objects[song_year_released_artist_array_of_objects.length] = {
		artist: song_expanded_multiple_properties_object_array[i].song_artist,
		year_released: date.getFullYear().toString()
	}
}

var object_keynames_array = ["year_released", "artist"];
var unique_years_released_artists_and_count_array = sort_filter_and_count_unique_array_of_objects(song_year_released_artist_array_of_objects, object_keynames_array);
var max_count = unique_years_released_artists_and_count_array.pop();

populate_table_from_array_of_arrays_with_object_array(unique_years_released_artists_and_count_array, "song_year_released_artist_timeline_table");

create_timeline_horizontal_bar_chart("year_released_artist_timeline_horizontal_bar_chart", unique_years_released_artists_and_count_array, max_count);
