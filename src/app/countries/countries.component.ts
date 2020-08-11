import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import {Country, CountriesQuery} from '../types.graphql';

const CountriesGQLQuery = gql`
{
  Country (first: 5){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
}`;

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.sass']
})
export class CountriesComponent implements OnInit {

  test: boolean;
  countries: Country[];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.watchQuery<CountriesQuery>({
      query: CountriesGQLQuery
    }).valueChanges.subscribe(result => {
        console.log(result);
        this.countries = result.data.Country;
      });
  }
}