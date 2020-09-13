import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashbord-card',
  templateUrl: './dashbord-card.component.html',
  styleUrls: ['./dashbord-card.component.css']
})
export class DashbordCardComponent implements OnInit {
 
  @Input('totalComfirmed') totalComfirmed;
  @Input('totalDeath') totalDeath;
  @Input('totalRecovered') totalRecovered;
  @Input('totalActive') totalActive;
  constructor() { }

  ngOnInit() {
  
  }

}
