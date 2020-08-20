import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass']
})
export class FiltersComponent implements OnInit {

  filtersInput: string;
  
  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.requestService.makeFilteredRequest(this.filtersInput);
  }
}
