import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service'
import { Country } from '../types.graphql';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.sass']
})
export class CountriesComponent implements OnInit{
  countries: Country[];
  isCountryCardVisible: boolean;

  get countryCardInfo() {
    return this.requestService.countryCard.value;
  }
  
  get pageNumber() {
    return this.requestService.currentOffset / 5 + 1;
  }

  get nextpageAvailable() {
    return this.requestService.nextPageAvailable;
   }

  get previousPageAvailable() {
    return this.requestService.previousPageAvailable;
  }

  constructor(private requestService: RequestService) {
    this.isCountryCardVisible = false;
  }

  ngOnInit() {
    this.requestService.countriesList$.subscribe(data => {
      console.log(data);
      this.countries = data
    });
  }

  fetchMore(direction: string) {
    if (direction === 'next') {
      this.requestService.fetchMore(environment.pageItemsCount);
    } else {
      this.requestService.fetchMore(-environment.pageItemsCount);
    }
  }

  getCountryCard(countryName: string) {
    console.log(this);
    this.requestService.getCountryCard(countryName, this.renderCard.bind(this));
  }

  toggleCardVisibility() {
    this.isCountryCardVisible = !this.isCountryCardVisible;
  }


  renderCard(card: Country) {
    console.log(card);
    console.log(this);
    this.toggleCardVisibility();
  }

}
