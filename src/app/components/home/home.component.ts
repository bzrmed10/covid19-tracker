import { DataServiceService } from '../../services/data-service.service';
import { GlobalDataSummary } from '../../models/global-data';
import { Component, OnInit, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { MatRadioChange } from '@angular/material';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  dataTable = [];
  totalComfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[];
  highcharts = Highcharts;
  chartOptions = {};
  columnHighcharts = Highcharts;
  columnchartOptions = {};
  chartof : string;
  countries = [];
  countryVal = [];
  color :string;
  dataMap;
  constructor(private dataService :DataServiceService,private homeService:HomeService) {
    
   }

  

  ngOnInit() {
   

    
    this.initPieChart();
    this.initColumnChart(this.countries,this.countryVal,this.chartof,this.color);
    this.dataService.getGlobalData().subscribe(
      {
      next : (result)=>{
       this.dataMap = result;
      this.dataService.dataChange.next(this.dataMap);
        this.globalData = result;
          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)){
                this.totalActive += cs.active;
                this.totalComfirmed += cs.confirmed;
                this.totalDeath += cs.deaths;
                this.totalRecovered += cs.recovered;
            }
          })
         
        this.initChart('c');
        
        
      }
    }
    )
  }
  initChart(caseType:string){

  
    this.dataTable = [];
    this.countries = [];
    this.countryVal = [];
   
    
    this.globalData.forEach(cs=>{
      let value : Number;
    
        if(caseType == 'c' )  { 
          this.chartof = 'Confirmed'
          this.color = "#7cb5ec"

          if(cs.confirmed != null ){
           value = cs.confirmed; 
          }
           
        } 
        if(caseType == 'd')  { 
          this.chartof = 'Deaths'
          this.color = "#f78181"
          if(cs.deaths != null ){
           value = cs.deaths;
          }
           
        } 
        if(caseType =='a' )  { 
          this.chartof = 'Active'
          this.color ="#fada69b8"
          if(cs.active != null){
          value = cs.active;
          }
          
       } 
       if(caseType == 'r' )  {
        this.chartof = 'Recovered'
        this.color ="#8eec7a96"
        if(cs.recovered != null ){
          value = cs.recovered;
        }  
       
     } 

        this.dataTable.push(
            {
              'name':cs.country,
              'y' : value,
            }    
        );
    
    });
    
    this.sortData(this.dataTable);
    this.chartOptions = {   
      title : {
        text: 'Worldwide COVID-19 Statistics  '  
     },
     subtitle: {
         text: this.chartof
     },
      series : [{
         type: 'pie',
         name: 'Browser share',
         data: this.dataTable
      }]
   };
   this.initColumnChart(this.countries,this.countryVal,this.chartof,this.color);

  }
  updateChart(event : MatRadioChange){
  
    
   
     let type :string = event.value;
     this.dataService.caseType.next(type);
    
     this.initChart(type);

    
  }

  initPieChart(){
    this.chartOptions = {  
      chart : {
         plotBorderWidth: null,
         plotShadow: false
      },
      title : {
         text: 'COVID 19 '   
      },
      tooltip : {
         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions : {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
               style: {
                  color: (Highcharts.theme)||
                  'black'
               }
            }
         }
      },
      credits: {
        enabled:false
      },
      exporting : {
        enabled:true
      },
      series : [{
         type: 'pie',
         name: 'Browser share',
         data: []
      }]
   };
   HC_exporting(Highcharts);
   setTimeout(()=>{
    window.dispatchEvent(
      new Event('resize')
      );
   },300);
  }


  initColumnChart(countries ,countryVal ,chartof : string,color:string){
   this.columnchartOptions =  {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Top 20 Countries affected by COVID-19'
      },
      subtitle: {
          text: chartof
      },
      xAxis: {
          categories: countries,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Cases'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.0f} cases</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      credits: {
        enabled:false
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: [{
          name: chartof,
          data: countryVal,
          color:color
  
      }]
  }
  }


  sortData(table){
    let items = this.homeService.sortData(table);

       items.forEach(val => {
       this.countries.push(val.name);
       this.countryVal.push(val.y);
   })
  }
}

