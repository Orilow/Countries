import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass']
})
export class FiltersComponent implements OnInit {

  private changesTimeout;

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

    this.changesTimeout = setTimeout('',0);
    this.onChanges();
  }

  ngOnInit(): void {
  }

  onChanges() {
    this.filtersForm.valueChanges.subscribe(val => {
      clearTimeout(this.changesTimeout);
      this.changesTimeout = setTimeout(this.onSubmit.bind(this), 1000);
    })
  }

  onSubmit() {
    clearTimeout(this.changesTimeout);
    const input = this.filtersForm.get('input').value;
    const chosenLangs = this.filtersForm.controls['languages'].value;
    const chosenCurrency = this.filtersForm.controls['currency'].value;
    let langsToSubmit = [];

    for (let key of Object.keys(chosenLangs)) {
      if (chosenLangs[key]) {
        langsToSubmit.push(key);
      }
    }

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
