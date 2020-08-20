import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service'
import { Country } from '../types.graphql';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.sass']
})
export class CountriesComponent implements OnInit{
  countries: Country[];

  constructor(private requestService: RequestService) {
  }

  ngOnInit() {
    this.requestService.countriesList$.subscribe(data => this.countries = data);
  }
}
