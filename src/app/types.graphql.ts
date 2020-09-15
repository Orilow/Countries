import { type } from 'os';

export type Country = {
    name: string;
    currencies: Currency[],
    officialLanguages: Language[],
    alpha2Code: string,
    alpha3Code: string
};

export type Currency = {
    code: string;
}

export type Language = {
    name: string;
}

export type CountriesQuery = {
    Country: Country[];
    nextCountries: Country[];
}

export type CountryCardQuery = {
    info: Country[]
}