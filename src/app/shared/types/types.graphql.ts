import { type } from 'os';

export type Country = {
    name: string;
    currencies: Currency[],
    officialLanguages: Language[],
    alpha2Code: string,
    alpha3Code: string,
    area: string,
    population: number,
    demonym: string,
    capital: string,
    populationDensity: number
};

export type Currency = {
    code: string;
}

export type Language = {
    name: string;
}

export type CountriesQueryType = {
    Country: Country[];
    nextCountries: Country[];
}

export type CountryCardQueryType = {
    info: Country[]
}
