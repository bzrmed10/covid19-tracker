import { Component, Inject, NgZone, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldMorocco from "@amcharts/amcharts4-geodata/worldMoroccoHigh";
import { DataServiceService } from 'src/app/services/data-service.service';
import { Router } from '@angular/router';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent  {
  dataMap;
  caseType : string;
  private chart: am4charts.XYChart;

  constructor(@Inject(PLATFORM_ID) private platformId,
               private zone: NgZone,
               private dataService :DataServiceService) {
    
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
  
    this.dataService.dataChange.subscribe((p) => {

      this.dataMap = p;
      initDataMap(chart,this.dataMap,this.caseType);
       
   });

   this.dataService.caseType.subscribe(res=>{
     this.caseType = res;

     setTimeout(()=>{
      initDataMap(chart,this.dataMap,this.caseType);
      },2000);
   })
    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.logo.disabled = true;
    // Set map definition
    chart.geodata = am4geodata_worldMorocco;
      // top title
  // let title = chart.titles.create();
  // title.fontSize = "1.5em";
  // title.text = "COVID-19 Spread Data";
  // title.align = "left";
  // title.horizontalCenter = "left";
  // title.marginLeft = 20;
  // title.paddingBottom = 10;
  // title.fill = am4core.color("#000000");
  // title.y = 20;
    // Set projection
    chart.projection = new am4maps.projections.Miller();
    
    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    
    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];
    
    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    
  
    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;
    
     // switch between map and globe
  let mapGlobeSwitch = chart.createChild(am4core.SwitchButton);
  mapGlobeSwitch.align = "right"
  mapGlobeSwitch.y = 15;
  mapGlobeSwitch.leftLabel.text = "Map";
  mapGlobeSwitch.leftLabel.fill = am4core.color("#3A506B");
  mapGlobeSwitch.rightLabel.fill = am4core.color("#3A506B");
  mapGlobeSwitch.rightLabel.text = "Globe";
  mapGlobeSwitch.verticalCenter = "top";


  mapGlobeSwitch.events.on("toggled", function() {
    if (mapGlobeSwitch.isActive) {
      chart.projection = new am4maps.projections.Orthographic;
      chart.backgroundSeries.show();
      chart.panBehavior = "rotateLongLat";
      polygonSeries.exclude = [];
    } else {
      chart.projection = new am4maps.projections.Miller;
      chart.backgroundSeries.hide();
      chart.panBehavior = "move";
      // removeAntarctica(mapData);
      // polygonSeries.data = mapData;
      // polygonSeries.exclude = ["AQ"];
    }
  })
    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    
    setTimeout(()=>{
      initDataMap(chart,this.dataMap,this.caseType);
      },4000);
    
    
    
    function animateBullet(circle) {
        let animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
        animation.events.on("animationended", function(event){
          animateBullet(event.target.object);
        })
    }
    
    let colorSet = new am4core.ColorSet();

   
    

    function initDataMap(chart:am4maps.MapChart,dataMap,caseType:string){
      let activeColor = am4core.color("#fada69b8");
      let confirmedColor = am4core.color("#7cb5ec");
      let recoveredColor = am4core.color("#8eec7a96");
      let deathsColor = am4core.color("#f78181");
      
    
      // for an easier access by key
      let colors = { active: activeColor, confirmed: confirmedColor, recovered: recoveredColor, deaths: deathsColor,all:confirmedColor };

      let tooltipTextMap;
      let typeCaseName;
      let oneCountrySelected:boolean = false;
      switch(caseType) { 
        case 'c' :{ 
          typeCaseName = 'confirmed';
          tooltipTextMap = "[bold]{country} : {confirmed} [/]\n Confirmed Cases [font-size:10px]"; 
           break; 
        } 
        case 'a': { 
          typeCaseName = 'active';
          tooltipTextMap = "[bold]{country} : {active} [/] \nActive Cases [font-size:10px]";  
           break; 
        } 
        case 'd': {
          typeCaseName = 'deaths';
          tooltipTextMap = "[bold]{country} : {deaths} [/] \nDeaths [font-size:10px]";  
           break; 
        } 
        case 'r': { 
          typeCaseName = 'recovered';
          tooltipTextMap = "[bold]{country} : {recovered} [/] \nRecovered [font-size:10px]";  
           break; 
        }
        case 'all': { 
          typeCaseName = 'all';
          oneCountrySelected = true;
          tooltipTextMap = "[bold]{country} \n  {confirmed} [/] Confirmed Cases\n [bold]{deaths} [/] Deaths\n [bold]{recovered} [/] Recovered \n [bold]{active} [/] Active Cases[font-size:10px]";  
           break; 
        }
        default:{ 
          typeCaseName = 'confirmed';
          tooltipTextMap = "[bold]{country} : {confirmed} [/]\n Confirmed Cases [font-size:10px]"; 
           break; 
        }  
     }
    

     if(chart.series.values.length>1){
      chart.series.removeIndex(1)
     }
     
     // Add image series
     let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      
     imageSeries.mapImages.template.propertyFields.longitude = "long";
     imageSeries.mapImages.template.propertyFields.latitude = "lat";
     imageSeries.mapImages.template.tooltipText = tooltipTextMap;

     imageSeries.mapImages.template.url = "/countries/{country}";
    //  imageSeries.mapImages.template.propertyFields.url = "url";
    


     //let circle = imageSeries.mapImages.template.createChild(am4core.Circle);

     
     //circle.opacity = 0.8
      // circle.fill = colors[typeCaseName];
      // circle.stroke = colors[typeCaseName];
     imageSeries.mapImages.template.fill = colors[typeCaseName];
     imageSeries.mapImages.template.stroke = colors[typeCaseName];

     
     let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
     circle2.radius = 3;
     circle2.fill = colors[typeCaseName];
     circle2.stroke = colors[typeCaseName];
     
     
     circle2.events.on("inited", function(event){
       animateBullet(event.target);
     })
      // imageSeries.data = []
      imageSeries.data = dataMap;
      if(oneCountrySelected){
        
          // let india = polygonSeries.getPolygonById("MA");
          // chart.zoomToMapObject(india);
          // india.isActive = true;
        // chart.zoomLevel = 3 ;
        // chart.zoomGeoPoint.latitude = dataMap[0].lat;
        // chart.zoomGeoPoint.longitude = dataMap[0].long;
        
      
       
       imageSeries.dataFields.value = 'confirmed';
           }else{
      imageSeries.dataFields.value = typeCaseName;
     }

let imageTemplate = imageSeries.mapImages.template;
imageTemplate.nonScaling = true

let circle = imageTemplate.createChild(am4core.Circle);
 circle.fillOpacity = 0.7;
// circle.propertyFields.fill = "color";
// circle.tooltipText = "{name}: [bold]{value}[/]";


imageSeries.heatRules.push({
  "target": circle,
  "property": "radius",
  "min": 4,
  "max": 50,
  "dataField": "value"
})


    }
    
  }

 

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}