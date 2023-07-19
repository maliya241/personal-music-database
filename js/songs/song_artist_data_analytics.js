const artists_array = get_property_values(songs_object, "song_artist");
const unique_artists_and_count_array = filter_and_count_unique_array(timsort(artists_array));



populate_table_from_array_of_arrays(unique_artists_and_count_array, "song_artist_data_analytics_table");