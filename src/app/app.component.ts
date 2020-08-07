import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

import {Country, CountriesQuery} from './types.graphql';

const CountriesGQLQuery = gql`
{
  Country {
    name
  }
}`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
