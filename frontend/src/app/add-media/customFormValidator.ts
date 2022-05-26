import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UrlHandlingStrategy } from '@angular/router';
import { min } from 'rxjs';

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


/**
 *  Check if the minimum Value <= maximum Value
 */
// alternative would be to use rxweb framework and import there validators
// https://www.npmjs.com/package/@rxweb/reactive-form-validators#form-validation
export function minMaxRelationValidator(minValue, maxValue): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const min = control.get(minValue).value;
        const max = control.get(maxValue).value;

        // check if both fields have a number value
        // using typeof in case either value would be a 0
        // (although currently this function is called form a field that does not accept a 0)
        if(!(typeof min === 'number') || !(typeof max === 'number'))
        return null;

        return min > max? { minMaxRelation: true }: null;
    }
}

/**
 * Validator to check if the form value is a correct url
 *  
 */
 // using the URL constructor for this 
 // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // little work around to prevent an empty url field to block the validation
        if(!value)
        return null;

        try {
            new URL(value);
            return null;
        } catch (error) {
            return { urlPattern: {message: "Not a valid url"} };
        }
    }
}