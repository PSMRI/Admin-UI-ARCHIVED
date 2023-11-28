/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: '[appDotAllow]'
})
export class DotallowDirective {

//   @HostListener("input", ["$event"]) onInput(ev: any) {
//     var regex = new RegExp(/[^d.]/g, '');
//     var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
//     if (regex.test(key)) {
//       ev.preventDefault();
//     }
//   }
// }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const sanitizedValue = currentValue.replace(/[^\d.]/g, '');
    if (currentValue !== sanitizedValue) {
      inputElement.value = sanitizedValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}

