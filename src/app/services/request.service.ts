import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {Country, CountriesQuery} from '../types.graphql';
import { Observable, BehaviorSubject } from 'rxjs';


const CountriesGQLQuery = gql`
query CountriesQuery($recordCount: Int, $filterValue: String){
  Country (filter: {name_contains:$filterValue}, first: $recordCount){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
}`;

const CountriesGQLQueryWithCurrency = gql`query CountriesQuery($recordCount: Int, $filterValue: String, $currency: String){
  Country (filter: {name_contains:$filterValue, currencies_some: {code: $currency}}, first: $recordCount){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
}`;

const CountriesGQLQueryWithLanguages = gql`
query CountriesQuery($recordCount: Int, $filterValue: String, $offLangs: [String!]){
  Country (filter: {name_contains:$filterValue, officialLanguages_some: {name_in: $offLangs}}, first: $recordCount){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
}`;

const CountriesGQLQueryFull = gql`query CountriesQuery($recordCount: Int, $filterValue: String, $currency: String, $offLangs: [String!]){
  Country (filter: {name_contains:$filterValue, currencies_some: {code: $currency}, officialLanguages_some: {name_in: $offLangs}}, first: $recordCount){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
}`

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private countries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>(undefined);
  public countriesList$: Observable<Country[]> = this.countries.asObservable();

  constructor(private apollo: Apollo) {
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQuery,
      variables:{
        recordCount: 5
      }
    }).subscribe(response => this.countries.next(response.data.Country));
   }

  makeFilteredRequest(filterValue: string = '') {
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQuery,
      variables:{
        recordCount: 5,
        filterValue: filterValue
      }
    }).subscribe(response => this.countries.next(response.data.Country));
  }

  makeFilteredRequestWithLangs(filterValue: string = '', langsList: Array<string>) {
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQueryWithLanguages,
      variables:{
        recordCount: 5,
        filterValue: filterValue,
        offLangs: langsList
      }
    }).subscribe(response => this.countries.next(response.data.Country))
  }

  makeFilteredRequestWithCurrencies(filterValue: string = '', currency: string){
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQueryWithCurrency,
      variables:{
        recordCount: 5,
        filterValue: filterValue,
        currency
      }
    }).subscribe(response => this.countries.next(response.data.Country))
  }

  makeFilteredFullRequest(filterValue: string = '', offLangs: Array<string>, currency: string) {
    console.log('making full');
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQueryFull,
      variables:{
        recordCount: 5,
        filterValue,
        offLangs,
        currency
      }
    }).subscribe(response => this.countries.next(response.data.Country))
  }
}
