import './components/home/home.component.css';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { CountriesComponent } from './components/countries/countries.component';
import { InformationsComponent } from './components/informations/informations.component';
import { MapComponent } from './components/map/map.component';


const appRoutes: Routes =[
    {path:'' ,component:HomeComponent},
    {path:'countries' ,component:CountriesComponent},
    {path:'countries/:country' ,component:CountriesComponent},
    {path:'map' ,component:MapComponent}
]
@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]

})
export class AppRoutingModule{

}