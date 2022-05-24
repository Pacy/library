import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custome Validator to check if it value is matching a currently existing age rating in germany
 * 
 */
export function germanAgeRatingValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }

        const germanAgeRatings = [0, 6, 12, 16, 18];

        return !germanAgeRatings.includes(value) ? { germanAgeRating: true } : null;
    }
}