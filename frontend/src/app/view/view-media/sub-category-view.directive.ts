import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[SubCategoryView]'
})
export class SubCategoryViewDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
