import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../../core/services/loader.service';
import { LoaderState } from '../../../../shared/types/types.loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass']
})
export class LoaderComponent implements OnInit, OnDestroy {

  show = false;
  subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
    });
    this.loaderService.show();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
