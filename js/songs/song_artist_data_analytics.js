
add_color_selectors_html_elements("artist_count_chart_color_selectors", "song_artist_data_analytics", "artist_count_pie_chart");

const artists_array = get_property_values(songs_object, "song_artist");
const unique_artists_and_count_array = filter_and_count_unique_array(timsort(artists_array));
var max_count = unique_artists_and_count_array.pop();

populate_table_from_array_of_arrays(unique_artists_and_count_array, "song_artist_data_analytics_table");

create_pie_chart("artist_count_pie_chart", unique_artists_and_count_array);