import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {Country, CountriesQuery} from '../types.graphql';
import { Observable, Observer, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


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

  makeFilteredRequest(filterValue: string = "") {
      this.apollo.query<CountriesQuery>({
        query: CountriesGQLQuery,
        variables:{
          recordCount: 5,
          filterValue: filterValue
        }
      }).subscribe(response => this.countries.next(response.data.Country));
  }
}
