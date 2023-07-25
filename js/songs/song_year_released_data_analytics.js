
add_color_selectors_html_elements("year_released_horizontal_bar_chart_color_selectors", "song_year_released_data_analytics", "year_released_horizontal_bar_chart");

const years_released_array = get_property_values(songs_object, "song_artist");
// for (i = 0; i < years_released_array.length; i++) {
	// const date = new Date(years_released_array[i]);
	// years_released_array[i] = date.getFullYear().toString();
// }

const unique_years_released_and_count_array = filter_and_count_unique_array(timsort(years_released_array));
var max_count = unique_years_released_and_count_array.pop();

populate_table_from_array_of_arrays(unique_years_released_and_count_array, "song_year_released_data_analytics_table");

create_horizontal_bar_chart("year_released_horizontal_bar_chart", unique_years_released_and_count_array, max_count);