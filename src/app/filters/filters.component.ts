import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass']
})
export class FiltersComponent implements OnInit {

  get isInputFilled() {
    return this.filtersForm.get('input').value !== '';
  }

  get languagesChosen() {
    return Number(Object.values(this.filtersForm.controls['languages'].value).reduce((sum: number, x: boolean) => x === true ? sum + 1 :  sum));
  }
  filtersForm: FormGroup;
  
  constructor(private requestService: RequestService, private formBuilder:FormBuilder) { 
    this.filtersForm = formBuilder.group({
      input: [''],
      languages: formBuilder.group({
        Russian: false,
        English: false,
        Chinese: false
      }),
      currency: formBuilder.control('')
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const input = this.filtersForm.get('input').value;
    const chosenLangs = this.filtersForm.controls['languages'].value;
    const chosenCurrency = this.filtersForm.controls['currency'].value;
    let langsToSubmit = [];

    for (let key of Object.keys(chosenLangs)) {
      if (chosenLangs[key]) {
        langsToSubmit.push(key);
      }
    }

    // console.log(input);
    // console.log(langsToSubmit);
    // console.log(chosenCurrency);


    if (langsToSubmit.length > 0 && chosenCurrency !== '') {
      this.requestService.makeFilteredFullRequest(input, langsToSubmit, chosenCurrency);
    } else if (langsToSubmit.length === 0 && chosenCurrency !== '') {
      this.requestService.makeFilteredRequestWithCurrencies(input, chosenCurrency)
    } else if (langsToSubmit.length !== 0 && chosenCurrency === '') {
      this.requestService.makeFilteredRequestWithLangs(input, langsToSubmit);
    } else {
      this.requestService.makeFilteredRequest(input);
    }
  }
}
