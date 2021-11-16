import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {
  // Careful with use. Only use on TRUSTED input to be executed other vulernable to XSS attacks
  // https://angular.io/api/platform-browser/DomSanitizer#bypasssecuritytrusthtml
  constructor(private _sanitizer:DomSanitizer) {
  }

  //currently unused
  transform(v:string):SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(v);
  }

}