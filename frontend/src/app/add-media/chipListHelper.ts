/**
 * Add the user input from the chip event to the end of the specified array
 * 
 * @param event mat-chip event
 * @param array that should receive the given user input
 */
export function chipListAdd(event, array) {
  const value = (event.value || '').trim();

  // Add value to given array
  if (value) {
    array.setValue([...array.value, value]);
    array.markAsDirty(); // currently necessary for the edit form to recognice that the field was changed (dirty)
  }

  // Clear the input value of the chiplist
  event.chipInput!.clear();
}


/**
 * Remove string from an array
 * 
 * @param s string that should be removed
 * @param array array from where it shoudl be removed
 */
export function chipListRemove(s: string, array): void {
  const index = array.value.indexOf(s);

  if (index >= 0) {
    array.value.splice(index, 1);
    array.markAsDirty(); // currently necessary for the edit form to recognice that the field was changed (dirty)
  }
}