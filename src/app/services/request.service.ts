import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {Country, CountriesQuery, CountryCardQuery} from '../types.graphql';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


const CountriesGQLQuery = gql`
query CountriesQuery($recordCount: Int, $filterValue: String, $offset: Int, $secondOffset: Int){
  Country: Country (filter: {name_contains:$filterValue}, first: $recordCount, offset: $offset){
    name
    currencies(orderBy: name_asc) { 
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
  nextCountries: Country (filter: {name_contains:$filterValue}, first: $recordCount, offset: $secondOffset){
   _id
  }
}`;

const CountriesGQLQueryWithCurrency = gql`query CountriesQuery($recordCount: Int, $filterValue: String, $currency: String, $offset: Int, $secondOffset: Int){
  Country: Country (filter: {name_contains:$filterValue, currencies_some: {code: $currency}}, first: $recordCount, offset: $offset){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
  nextCountries: Country (filter: {name_contains:$filterValue, currencies_some: {code: $currency}}, first: $recordCount, offset: $secondOffset) {
    _id
  }
}`;

const CountriesGQLQueryWithLanguages = gql`
query CountriesQuery($recordCount: Int, $filterValue: String, $offLangs: [String!], $offset: Int, $secondOffset: Int){
  Country: Country (filter: {name_contains:$filterValue, officialLanguages_some: {name_in: $offLangs}}, first: $recordCount, offset: $offset){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
  nextCountries: Country (filter: {name_contains:$filterValue, officialLanguages_some: {name_in: $offLangs}}, first: $recordCount, offset: $secondOffset){
    _id
  }
}`;

const CountriesGQLQueryFull = gql`query CountriesQuery($recordCount: Int, $filterValue: String, $currency: String, $offLangs: [String!], $offset: Int, $secondOffset: Int){
  Country: Country (filter: {name_contains:$filterValue, currencies_some: {code: $currency}, officialLanguages_some: {name_in: $offLangs}}, first: $recordCount, offset: $offset){
    name
    currencies(orderBy: name_asc) {
      code
    }
    officialLanguages(orderBy: name_asc) {
      name
    }
  }
  nextCountries: Country (filter: {name_contains:$filterValue, currencies_some: {code: $currency}, officialLanguages_some: {name_in: $offLangs}}, first: $recordCount, offset: $secondOffset) {
    _id
  }
}`

const CountryCardReq = gql`query CountryCard ($name: String!){
	info: Country(filter: {name: $name}) {
    name
    alpha2Code
    alpha3Code
    area
    capital
    populationDensity
    demonym
    gini
    nameTranslation
    nativeName
    numericCode
    population
    location {longitude, latitude}
    # check the docs for more info
  }
}`


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private countries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>(undefined);
  public countriesList$: Observable<Country[]> = this.countries.asObservable();
  public countryCard: BehaviorSubject<Country> = new BehaviorSubject<Country>(undefined);
  public countryCard$: Observable<Country> = this.countryCard.asObservable();
  private lastRequest: string;
  public currentOffset= 0;

  public nextPageAvailable = false;
  public previousPageAvailable = false;

  constructor(private apollo: Apollo) {
    this.makeMainRequest();
  }

  getCountryCard(countryName: string, callbackFunc: Function) {
    this.apollo.query<CountryCardQuery>({
      query: CountryCardReq,
      variables: {
        name: countryName
      }
    }).subscribe(res => {
      this.countryCard.next(res.data.info[0]);
      callbackFunc(res.data);
    })
  }

  fetchMore(offset: number) {
    console.log(this.lastRequest);
    this.currentOffset += offset;
    const requestMethodName = this.lastRequest.split(' ')[0];
    if (this.lastRequest === this.makeMainRequest.name) {
      this.makeMainRequest();
    } else if (requestMethodName === this.makeFilteredRequest.name) {
      this.makeFilteredRequest(...this.lastRequest.split(' ').slice(1));
    } else if (requestMethodName === this.makeFilteredRequestWithLangs.name) {
      const splitted = this.lastRequest.split(' ').slice(1);
      this.makeFilteredRequestWithLangs(splitted[0], JSON.parse(splitted[1]));
    } else if (requestMethodName === this.makeFilteredRequestWithCurrencies.name) {
      const splitted = this.lastRequest.split(' ').slice(1);
      this.makeFilteredRequestWithCurrencies(splitted[0], splitted[1]);
    } else if (requestMethodName === this.makeFilteredFullRequest.name) {
      const splitted = this.lastRequest.split(' ').slice(1);
      this.makeFilteredFullRequest(splitted[0], JSON.parse(splitted[1]), splitted[2]);
    }
  }

  refreshPaginationButtons(data: CountriesQuery) {
    this.currentOffset === 0 ? this.previousPageAvailable = false : this.previousPageAvailable = true;
    if (data.Country.length < environment.pageItemsCount) {
      this.nextPageAvailable = false;
    } else if (data.nextCountries.length !== 0) {
      this.nextPageAvailable = true;
    } else {
      this.nextPageAvailable = false;
    }
  }

  makeMainRequest() {
    if (this.lastRequest !== this.makeMainRequest.name) {
      this.currentOffset = 0;
    }
    this.apollo.watchQuery<CountriesQuery>({
      query: CountriesGQLQuery,
      variables: {
        recordCount: environment.pageItemsCount,
        offset: this.currentOffset,
        secondOffset: this.currentOffset + environment.pageItemsCount
      }
    }).valueChanges
      .subscribe(response => {
        this.refreshPaginationButtons(response.data);
        this.countries.next(response.data.Country);
      });
    this.lastRequest = this.makeMainRequest.name;
  }

  makeFilteredRequest(filterValue: string = '') {
    const requestName = this.makeFilteredRequest.name + ' ' + filterValue;
    if (this.lastRequest !== requestName)
        this.currentOffset = 0;
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQuery,
      variables:{
        recordCount: environment.pageItemsCount,
        filterValue: filterValue,
        offset: this.currentOffset,
        secondOffset: this.currentOffset + environment.pageItemsCount
      }
    }).subscribe(response => {
      this.refreshPaginationButtons(response.data);
      this.countries.next(response.data.Country)
    });
    this.lastRequest = requestName;
  }

  makeFilteredRequestWithLangs(filterValue: string = '', langsList: Array<string>) {
    const requestName = this.makeFilteredRequestWithLangs.name + ' ' + filterValue + ' ' + JSON.stringify(langsList);
    if (this.lastRequest !== requestName)
        this.currentOffset = 0;
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQueryWithLanguages,
      variables:{
        recordCount: environment.pageItemsCount,
        offset: this.currentOffset,
        secondOffset: this.currentOffset + environment.pageItemsCount,
        filterValue: filterValue,
        offLangs: langsList
      }
    }).subscribe(response => {
      this.refreshPaginationButtons(response.data);
      this.countries.next(response.data.Country)
    })
    this.lastRequest = requestName;
  }

  makeFilteredRequestWithCurrencies(filterValue: string = '', currency: string) {
    const requestName = this.makeFilteredRequestWithCurrencies.name + ' ' + filterValue + ' ' + currency;
    if (this.lastRequest !== requestName)
        this.currentOffset = 0;
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQueryWithCurrency,
      variables:{
        recordCount: environment.pageItemsCount,
        filterValue: filterValue,
        currency,
        offset: this.currentOffset,
        secondOffset: environment.pageItemsCount + this.currentOffset
      }
    }).subscribe(response => {
      this.refreshPaginationButtons(response.data);
      this.countries.next(response.data.Country)
    });
    this.lastRequest = requestName;
  }

  makeFilteredFullRequest(filterValue: string = '', offLangs: Array<string>, currency: string) {
    const requestName = this.makeFilteredFullRequest.name + ' ' + filterValue + ' ' + JSON.stringify(offLangs) + ' ' + currency;
    if (this.lastRequest !== requestName)
        this.currentOffset = 0;
    this.apollo.query<CountriesQuery>({
      query: CountriesGQLQueryFull,
      variables:{
        recordCount: environment.pageItemsCount,
        offset: this.currentOffset,
        secondOffset: this.currentOffset + environment.pageItemsCount,
        filterValue,
        offLangs,
        currency
      }
    }).subscribe(response => {
      this.refreshPaginationButtons(response.data);
      this.countries.next(response.data.Country)
    })
    this.lastRequest = requestName;
  }
}
