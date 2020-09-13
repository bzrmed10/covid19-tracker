import { DataServiceService } from '../../services/data-service.service';
import { GlobalDataSummary } from '../../models/global-data';
import { DateCountryData } from '../../models/date-country-data';
import { Component, OnInit , ViewChild } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import HC_exporting from 'highcharts/modules/exporting';
import { AllDataByCountry } from '../../models/all-data-by-country';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HomeService } from 'src/app/services/home.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  
  defaultCountry :string;

  totalComfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  data : GlobalDataSummary[];
  countries : string[] = [];
  dateCountryData;
  dateDeathByCountryData;
  dateRecovredByCountryData;
  selectedCountryData : DateCountryData [];
  selectedDeathByCountryData : DateCountryData [];
  selectedRecoveredByCountryData : DateCountryData [];
  AlldataByCountry :AllDataByCountry[];
  chartOptions={};
  Highcharts =Highcharts;
  
  tableCase=[];
  tabledays = [];
  tabledeath = [];
  tableRecovered= [];


  chartOptionsPerDay={};
  HighchartsPerDay =Highcharts;
  tableCasePerDay=[];
  tabledaysPerDay = [];
  tabledeathPerDay = [];
  tableRecoveredPerDay= [];

 


  displayedColumns: string[] = ['country', 'date','cases','numbercasesperdate','deaths','numberdeathperdate','recovred','numberrecovredperdate'];
  dataSource: MatTableDataSource<DateCountryData>;
  @ViewChild(MatPaginator ,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort ,{static:false}) sort: MatSort;
  dataMap;
  constructor(private dataService : DataServiceService,
    public datepipe: DatePipe,
    public homeService:HomeService,
    public route :ActivatedRoute,
    public router :Router) { 
 
  }
 
  ngOnInit() {
    if(this.route.snapshot.params['country']){
      this.defaultCountry = this.route.snapshot.params['country'];

    }else{
    this.defaultCountry ="Morocco";

    }
    
    
    merge(
      this.dataService.getDateCountryData().pipe(
        map(result=>{
          this.dateCountryData = result;
          
        })
      ), 
      this.dataService.getDateDeathByCountryData().pipe(
        map(result=>{
          this.dateDeathByCountryData = result;
        })
      ), 
      this.dataService.getDateRecoveredByCountryData().pipe(
        map(result=>{
          this.dateRecovredByCountryData = result;
        })
      ), 
      this.dataService.getGlobalData().pipe(map(result=>{
        this.data = result;       
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
      }))
    ).subscribe(
      {
        complete : ()=>{
         
         this.updateCountry(this.defaultCountry);
        }
      }
    )



   
    this.dataService.getGlobalData().subscribe(result=>{
      this.data = result;
     
      result.forEach(cs=>{
        this.countries.push(cs.country);
        
      })
    });

    this.setChartOptions(Highcharts,this.tableCase,this.tableRecovered,this.tabledeath);
    this.setChartOptionsPerDay(this.HighchartsPerDay,this.tableCasePerDay,this.tableRecoveredPerDay,this.tabledeathPerDay,this.tabledaysPerDay);


  }


  updateChart(){
   
    this.tableCase = [];
    this.tabledays = [];
    this.tabledeath = [];
    this.tableRecovered = [];

  this.tableCasePerDay=[];
  this.tabledeathPerDay = [];
  this.tableRecoveredPerDay= [];

   this.getNumCasePerDay(this.selectedCountryData);
   this.getNumCasePerDay(this.selectedDeathByCountryData);
   this.getNumCasePerDay(this.selectedRecoveredByCountryData);
    this.selectedCountryData.forEach(cs => {
      
      this.tableCase.push(cs.cases);    
      this.tableCasePerDay.push(cs.numbercasesperdate);
      this.tabledays.push( this.datepipe.transform(cs.date, 'yyyy/MM/dd')); 
      this.tabledaysPerDay.push( this.datepipe.transform(cs.date, 'yyyy/MM/dd')); 
    });
    this.selectedDeathByCountryData.forEach(cs => {
        this.tabledeath.push(cs.cases);
        this.tabledeathPerDay.push(cs.numbercasesperdate);
    });
    this.selectedRecoveredByCountryData.forEach(cs => {
      this.tableRecovered.push(cs.cases);
      this.tableRecoveredPerDay.push(cs.numbercasesperdate);

  });

    this.setChartOptions(Highcharts,this.tableCase,this.tableRecovered,this.tabledeath);
    this.setChartOptionsPerDay(this.HighchartsPerDay,this.tableCasePerDay,this.tableRecoveredPerDay,this.tabledeathPerDay,this.tabledaysPerDay);
  }

  updateCountry(country : string){
    this.router.navigate(['/countries',country]);
    let items = this.data.filter(item => item.country == country);
    this.dataMap = items;
    this.dataService.dataChange.next(this.dataMap);
    this.dataService.caseType.next('all');

    this.data.forEach(cs =>{
      
      if(cs.country === country){
        
        this.totalActive = cs.active;
        this.totalComfirmed = cs.confirmed;
        this.totalDeath = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
      
    })
    
     this.selectedCountryData = this.getNumCasePerDay(this.dateCountryData[country]);
     this.selectedDeathByCountryData = this.getNumCasePerDay(this.dateDeathByCountryData[country])
     this.selectedRecoveredByCountryData = this.getNumCasePerDay(this.dateRecovredByCountryData[country])
     this.AlldataByCountry = this.mergeData(this.selectedCountryData, this.selectedDeathByCountryData,this.selectedRecoveredByCountryData);
     this.dataSource = new MatTableDataSource(this.AlldataByCountry);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
     
    this.updateChart()
   
  }

  getNumCasePerDay(data:DateCountryData []){

    for(let i=0;i<data.length;i++){
      if(i == 0) {
        data[i].numbercasesperdate = data[i].cases;
      }
      else{
        data[i].numbercasesperdate =  data[i].cases-data[i-1].cases;
      }
      
    }
    
    return data;
  }

  mergeData(tab1 :DateCountryData[],tab2:DateCountryData[],tab3:DateCountryData[]){
    if(tab1.length == tab2.length && tab1.length == tab3.length){
      let alldataByCountry =[];
      for(let i=0;i<tab1.length;i++){
        alldataByCountry.push({
          'country':tab1[i].country,
          'date':tab1[i].date,
          'cases':tab1[i].cases,
          'numbercasesperdate':tab1[i].numbercasesperdate,
          'deaths':tab2[i].cases,
          'numberdeathperdate':tab2[i].numbercasesperdate,
          'recovred':tab3[i].cases,
          'numberrecovredperdate':tab3[i].numbercasesperdate
        });
      }
      return alldataByCountry;
    }else{
      console.log("tab not same length");
    
    }
  }

setChartOptions(Highcharts,tableCase,tableRecovered,tabledeath){
  this.chartOptions = {
    chart: {
        // type: 'area'
    },
    title: {
        text: 'Cumulative graph of corona virus evolution'
    },
    subtitle: {
        text: null
    },
    xAxis: {
        categories: this.tabledays,
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: 'Cases'
        }
  
    },
    tooltip: {
        split: true,
        valueSuffix: ' cases'
    },
    credits: {
      enabled:false
    },
    exporting : {
      enabled:true
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [{
        name: 'Confirmed',
        data: tableCase,
    }
    , {
      
      name: 'Deaths',
      data: tabledeath,
      color:"#f78181"
    },
    {
      name: 'Recovered',
      data: tableRecovered,
      color:"#8eec7a96"

     
  }
  ]
  };
  HC_exporting(Highcharts);
setTimeout(()=>{
 window.dispatchEvent(
   new Event('resize')
   );
},300);
}
applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  setChartOptionsPerDay(Highcharts,tableCase,tableRecovered,tabledeath,tabledays){

    
    this.chartOptionsPerDay = {
      chart: {
          type: 'area'
      },
      title: {
          text: 'COVID-19 Daily Statistics '
      },
      subtitle: {
          text: null
      },
      xAxis: {
          categories: tabledays,
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
      yAxis: {
          title: {
              text: 'Cases'
          }
    
      },
      tooltip: {
          split: true,
          valueSuffix: ' cases'
      },
      credits: {
        enabled:false
      },
      exporting : {
        enabled:true
      },
      plotOptions: {
          area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                  lineWidth: 1,
                  lineColor: '#666666'
              }
          }
      },
      series: [{
          name: 'Confirmed',
          data: tableCase,
      }
      , {
        
        name: 'Deaths',
        data: tabledeath,
        color:"#f78181"
      },
      {
        name: 'Recovered',
        data: tableRecovered,
        color:"#8eec7a96"
       
    }
    ]
    };
    HC_exporting(Highcharts);
  setTimeout(()=>{
   window.dispatchEvent(
     new Event('resize')
     );
  },300);
  }
}
