/* eslint-disable */
import {gql} from "apollo-angular";

export const CountriesGQLQuery = gql`
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

export const CountriesGQLQueryWithCurrency = gql`query CountriesQuery($recordCount: Int, $filterValue: String, $currency: String, $offset: Int, $secondOffset: Int){
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

export const CountriesGQLQueryWithLanguages = gql`
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

export const CountriesGQLQueryFull = gql`query CountriesQuery($recordCount: Int, $filterValue: String, $currency: String, $offLangs: [String!], $offset: Int, $secondOffset: Int){
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
}`;

export const CountryCardQuery = gql`query CountryCard ($name: String!){
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
}`;
