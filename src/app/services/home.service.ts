import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  countrySubject = new Subject<boolean>();
 
  constructor() { }


  sortData(table){
    table.sort(function (a, b) {
      return b.y - a.y;
    });

    let items = table.slice(0, 20);

    return items;
  }


  

}
