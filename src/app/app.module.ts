import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CountriesComponent } from './components/countries/countries.component';
import { AppRoutingModule } from './app-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';

import { HttpClientModule } from '@angular/common/http';
import { DashbordCardComponent } from './components/dashbord-card/dashbord-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableComponent } from './components/home/datatable/datatable.component';
import { InformationsComponent } from './components/informations/informations.component';
import { MapComponent } from './components/map/map.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CountriesComponent,
    DashbordCardComponent,
    DatatableComponent,
    InformationsComponent,
    MapComponent,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  //  TooltipModule.forRoot(),
    GoogleChartsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HighchartsChartModule
    
  ],
  providers: [DatePipe],
   bootstrap: [AppComponent]
})
export class AppModule { }
