import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeService } from './home/home.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule
  ],
  providers: [HomeService],
})
export class HomeModule { }
