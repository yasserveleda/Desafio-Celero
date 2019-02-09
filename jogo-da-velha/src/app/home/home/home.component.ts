import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) {
    // console.log(this.homeService.getCharacters());
  }

  ngOnInit() {
    // teste
  }

  public getCharacters(name) {
    this.homeService.getCharacters(name).subscribe(
      response => {
        console.log(response);
        const responseList = response.data.results;
        responseList.map(function(item) {
          console.log(item.name);
        });
      },
      error => {
        // Usar dados mock em ambiente local
        console.log(error);
      }
    );
  }

}
