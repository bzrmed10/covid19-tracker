import { DataServiceService } from '../../../services/data-service.service';
import { GlobalDataSummary } from '../../../models/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HomeService } from 'src/app/services/home.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {

  globalData : GlobalDataSummary[];
  displayedColumns: string[] = ['country', 'confirmed', 'deaths', 'active','recovered'];
  dataSource : MatTableDataSource<GlobalDataSummary>;
  @ViewChild(MatPaginator ,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort ,{static:false}) sort: MatSort;
 
  constructor(private dataService :DataServiceService,
              private homeService:HomeService,
              private router:Router) { }

  ngOnInit() {

    this.dataService.getGlobalData().subscribe(
      {
      next : (result)=>{
        //  console.log(result);
        this.globalData = result;
        this.dataSource = new MatTableDataSource(this.globalData);
   
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
      
      }
    }
    );


}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


selectCountry(row){
   let country : string = row.country;
   
  this.router.navigate(['countries',country]);
}

}