/**************
insertion_sort sorts array from left index to right index. Not case sensitive.
arr parameter
left parameter has a default value of 0 when null or undefined value is given.
right parameter  has a default value of array length minus one when null or undefined value is given. 
Executes in timsort function.
Return sorted array.

Copied from SitePoint Article "10 Best Sorting Algorithms Explained"
Modification(s): added .toLowerCase to make not case sensitive
**************/
function insertion_sort(arr, left = 0, right = arr.length - 1) {
  for (let i = left + 1; i <= right; i++) {
    const keyItem = arr[i];
    let j = i - 1;
    while (j >= left && arr[j].toLowerCase() > keyItem.toLowerCase()) { //added .toLowerCase to make not case sensitive
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = keyItem;
  }
  return arr;
}

/**************
merge merges array chunks together.
Executes in timsort function.
Return sorted array.

Copied from SitePoint Article "10 Best Sorting Algorithms Explained"
**************/
function merge(left, right) {
  let i = 0;
  let j = 0;
  const merged = [];

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      merged.push(left[i]);
      i++;
    } else {
      merged.push(right[j]);
      j++;
    }
  }

  return merged.concat(left.slice(i)).concat(right.slice(j));
}

/**************
timsort uses insertion sort to sort array chunks and then merges the chunks together to make completed sorted array. 
Executes in form_suggestions function and as a part of page set-up in its corresponding page js file.
Return sorted array.

Copied from SitePoint Article "10 Best Sorting Algorithms Explained"
**************/
function timsort(arr) {
  const minRun = 32; //can be 32 or 64; at least a multiple of 2
  const n = arr.length;

  for (let i = 0; i < n; i += minRun) {
    insertion_sort(arr, i, Math.min(i + minRun - 1, n - 1)); //calculates how to break up the array and sorts each chunk.
  }

  let size = minRun;
  while (size < n) {
    for (let start = 0; start < n; start += size * 2) {
      const midpoint = start + size - 1;
      const end = Math.min(start + size * 2 - 1, n - 1);
      const merged = merge(
        arr.slice(start, midpoint + 1),
        arr.slice(midpoint + 1, end + 1)
      );
      arr.splice(start, merged.length, ...merged);
    }
    size *= 2;
  }

  return arr;
}

/**************
insertion_sort_object 
object parameter is an object.
object_keyname parameter is a string the property used to sort the object.
left parameter has a default value of 0 when null or undefined value is given.
right parameter  has a default value of object length minus one when null or undefined value is given. 
Executes in timsort function.
Return sorted object.

Copied from SitePoint Article "10 Best Sorting Algorithms Explained"
Modification(s): added .toLowerCase to make not case sensitive; modified to work with objects
**************/
function insertion_sort_object(object, object_keyname, left = 0, right = object.length - 1) {
  for (let i = left + 1; i <= right; i++) {
    const keyObject = object[i];
    let j = i - 1;
	
    while (j >= left && object[j][object_keyname].toLowerCase() > keyObject[object_keyname].toLowerCase()) { //added .toLowerCase to make not case sensitive
      object[j + 1] = object[j];
      j--;
    }
    object[j + 1] = keyObject;
  }
  return object;
}

/**************
merge merges object chunks together.
Executes in timsort function.
Return sorted object.

Copied from SitePoint Article "10 Best Sorting Algorithms Explained"
Modification(s): modified to work with objects
**************/
function merge_object(left, right, object_keyname) {
  let i = 0;
  let j = 0;
  const merged = [];

  while (i < left.length && j < right.length) {
    if (left[i][object_keyname] < right[j][object_keyname]) {
      merged.push(left[i]);
      i++;
    } else {
      merged.push(right[j]);
      j++;
    }
  }

  return merged.concat(left.slice(i)).concat(right.slice(j));
}

/**************
timsort uses insertion sort to sort a given object chunks based on a given parameter and then merges the chunks together to make completed sorted object. 
object parameter is the object to be sorted.
object_keyname parameter is a string of the property to sort the object.
Executes in form_suggestions function and as a part of page set-up in its corresponding page js file.
Return sorted object.

Copied from SitePoint Article "10 Best Sorting Algorithms Explained"
Modification(s): modified to work with objects
**************/
function timsort_object(object, object_keyname) {
  const minRun = 32; //can be 32 or 64; at least a multiple of 2
  const n = object.length;
  
  for (let i = 0; i < n; i += minRun) {
    insertion_sort_object(object, object_keyname, i, Math.min(i + minRun - 1, n - 1)); //calculates how to break up the object and sorts each chunk.
  }

  let size = minRun;
  while (size < n) {
    for (let start = 0; start < n; start += size * 2) {
      const midpoint = start + size - 1;
      const end = Math.min(start + size * 2 - 1, n - 1);
      const merged = merge_object(
        object.slice(start, midpoint + 1),
        object.slice(midpoint + 1, end + 1),
		object_keyname
      );
      object.splice(start, merged.length, ...merged);
    }
    size *= 2;
  }

  return object;
}

/**************
filter_unique_array takes given array that has been sorted and puts unique items into a new array and returns the new array.
sorted_array parameter must be sorted.
Executes in form_suggestions function.
Return array of unique items.
**************/
function filter_unique_array(sorted_array) {
	var filtered_array = [];
	for (i = 0; i < sorted_array.length; i++) {
		if (sorted_array[i] !== sorted_array[i+1] && sorted_array[i].length > 0) {
			filtered_array[filtered_array.length] = sorted_array[i];
		}
	} 
	return filtered_array;
}

/**************
filter_and_count_unique_array takes given array that has been sorted and puts unique items into a new array and puts count of repeats of each item into another array.
sorted_array parameter must be sorted.
Executes as a part of page set-up in its corresponding page js file.
Return array with array of unique items as the first element, array of unique item count as the second element, array of unique item count percentages as the third element, and max count as the last element.
**************/
function filter_and_count_unique_array(sorted_array) {
	var unique_array = [];
	var count_array = [];
	var percentage_array = [];
	var count = 1;
	var max_count = 0;
	for (i = 0; i < sorted_array.length; i++) {
		if (sorted_array[i] !== sorted_array[i+1] && sorted_array[i].length > 0) {
			unique_array[unique_array.length] = sorted_array[i];
			count = 1; //reset count for new item
			count_array[count_array.length] = count;
			percentage_array[percentage_array.length] = (100*count)/sorted_array.length;
		} else if (sorted_array[i] === sorted_array[i+1] && sorted_array[i].length > 0) {
			count++;
			count_array[unique_array.length] = count;
			percentage_array[unique_array.length] = (100*count)/sorted_array.length;
			max_count = Math.max(max_count, count);
		}
	} 
	count_array.splice(-1); //remove last element because it does not correspond to anything
	percentage_array.splice(-1); //remove last element because it does not correspond to anything
	return [unique_array, count_array, percentage_array, max_count];
}

/**************
sort_filter_and_count_unique_array_of_objects 
unsorted_array_of_objects parameter is an unsorted array of objects.
object_keynames_array parameter is an array of string object keynames in the order for the objects to be sorted.
Executes as a part of page set-up in its corresponding page js file.
Return array with array of unique objects as the first element, array of unique item count as the second element, array of unique item count percentages as the third element, and max count as the last element.
**************/
function sort_filter_and_count_unique_array_of_objects(unsorted_array_of_objects, object_keynames_array) {	
	//sort array of objects
	var sorted_array_of_objects = [];
	for (i = 0; i < object_keynames_array.length; i++) {
		sorted_array_of_objects = timsort_object(unsorted_array_of_objects, object_keynames_array[i]);
	}	
	
	//filter and count unique objects	
	var unique_objects_array = [];
	var count_array = [];
	var percentage_array = [];
	var count = 1;
	var max_count = 0;
	
	for (i = 0; i < sorted_array_of_objects.length; i++) { //iterate through array of objects
		var unique_item_boolean = null; //assume neither
		if (i < (sorted_array_of_objects.length-1)) {
			for (j = 0; j < object_keynames_array.length; j++) { //iterate through object properties
				if (sorted_array_of_objects[i][object_keynames_array[j]] !== sorted_array_of_objects[i+1][object_keynames_array[j]] && sorted_array_of_objects[i][object_keynames_array[j]].length > 0) {
					unique_item_boolean = true;
					break;
				} else if (sorted_array_of_objects[i][object_keynames_array[j]] === sorted_array_of_objects[i+1][object_keynames_array[j]] && sorted_array_of_objects[i][object_keynames_array[j]].length > 0) {
					unique_item_boolean = false;
					break;
				}
			}
		} else { //last item counts as unique because it is not equal to undefined 
			unique_item_boolean = true;
		}
	
		if (unique_item_boolean) {
			unique_objects_array[unique_objects_array.length] = sorted_array_of_objects[i];
			count = 1; //reset count for new item
			count_array[count_array.length] = count;
			percentage_array[percentage_array.length] = (100*count)/sorted_array_of_objects.length;
		} else if (unique_item_boolean === false) {
			count++;
			count_array[unique_objects_array.length] = count;
			percentage_array[unique_objects_array.length] = (100*count)/sorted_array_of_objects.length;
			max_count = Math.max(max_count, count);
		}
	} 
	count_array.splice(-1); //remove last element because it does not correspond to anything
	percentage_array.splice(-1); //remove last element because it does not correspond to anything
	
	return [unique_objects_array, count_array, percentage_array, max_count];
}

