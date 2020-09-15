import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Country } from '../types.graphql';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  public info: Country;

  @Input()
  cardVisibility: boolean;

  @Output()
  toggleVisibility = new EventEmitter();

  constructor(private requestSevice: RequestService) {
    this.requestSevice.countryCard$.subscribe(data => {
      console.log(data);
      this.info = data});
   }

  ngOnInit(): void {
  }

  closeCard() {
    this.cardVisibility = false;
    this.toggleVisibility.emit(this.cardVisibility);
  }
}
