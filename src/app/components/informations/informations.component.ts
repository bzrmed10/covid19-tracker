import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {
  defaultCountry2= false;
  constructor(private homeService:HomeService) { }

  ngOnInit() {
    this.homeService.countrySubject.subscribe(countrysub=>{
      this.defaultCountry2 = countrysub;
      console.log("---------------------"+this.defaultCountry2);
    });
  }

}
