import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../../core/services/request.service'
import { Country } from '../../../../shared/types/types.graphql';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.sass']
})
export class CountriesComponent implements OnInit{
  countries: Country[];
  isCountryCardVisible: boolean;

  get currentPageNumber() {
    return this.requestService.currentOffset / 5 + 1;
  }

  get nextPageAvailable() {
    return this.requestService.nextPageAvailable;
   }

  get previousPageAvailable() {
    return this.requestService.previousPageAvailable;
  }

  constructor(private requestService: RequestService) {
    this.isCountryCardVisible = false;
  }

  ngOnInit() {
    this.requestService.countriesList$.subscribe(data => this.countries = data);
  }

  fetchMore(direction: string) {
    if (direction === 'next') {
      this.requestService.fetchMore(environment.pageItemsCount);
    } else {
      this.requestService.fetchMore(-environment.pageItemsCount);
    }
  }

  getCountryCard(countryName: string) {
    this.requestService.getCountryCard(countryName, this.toggleCardVisibility.bind(this));
  }

  toggleCardVisibility() {
    this.isCountryCardVisible = !this.isCountryCardVisible;
  }
}
