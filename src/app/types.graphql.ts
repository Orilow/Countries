import { type } from 'os';

export type Country = {
    name: string;
    currencies: Currency[],
    officialLanguages: Language[]
};

export type Currency = {
    code: string;
}

export type Language = {
    name: string;
}

export type CountriesQuery = {
    Country: Country[];
}