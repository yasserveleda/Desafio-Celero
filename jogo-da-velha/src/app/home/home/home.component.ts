import { Component, OnInit, HostListener } from '@angular/core';
import { HomeService } from './home.service';
import {Observable} from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  characters: any[];
  img_1 = `./assets/img/1.png`;
  img_2 = `./assets/img/2.png`;
  player = 1;
  board = [];
  winner;
  endGame = true;
  selectedCharacters = false;
  gameTie = false;
  listGetCharacters = [];

  // First Character
  firstCharacter;
  firstModelCharacter;
  firstSelected;
  firstImagePath;
  firstScore = 0;

  // Second Character
  secondCharacter;
  secondModelCharacter;
  secondSelected;
  secondImagePath;
  secondScore = 0;

  constructor(private homeService: HomeService) { }

  ngOnInit() { }

  search = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => {
        const character_1 = this.firstModelCharacter;
        const character_2 = this.secondModelCharacter;

        if (character_1 && character_1.length >= 2) {
          this.getCharacters(character_1, 1);
        } else if (character_2 && character_2.length >= 2) {
          this.getCharacters(character_2, 2);
        }
      }),
      debounceTime(500),
      map(term => term === '' ? []
        : this.listGetCharacters.filter(v => v.name))
    )

  formatter = (x: {name: string}) => x.name;

  characterSelect (event, numberCharacter) {
    if (event && event.item) {
      if (numberCharacter === 1) {
        this.firstCharacter = event.item;
        this.firstSelected = true;
        this.firstImagePath = `${this.firstCharacter.thumbnail.path}.${this.firstCharacter.thumbnail.extension}`;
      } else {
        this.secondCharacter = event.item;
        this.secondSelected = true;
        this.secondImagePath = `${this.secondCharacter.thumbnail.path}.${this.secondCharacter.thumbnail.extension}`;
      }
      this.listGetCharacters = [];

      if (this.firstCharacter && this.secondCharacter) {
        this.selectedCharacters = true;
        this.endGame = false;
      }
    }
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    const clickedOnCell = event.target.className;
    if (`cell` === clickedOnCell) {
      if (!this.endGame) {
        const id = event.target.id;
        const square = document.getElementById(id);
        const emptyCell = (!square.style.backgroundImage || square.style.backgroundImage === `none`);
        if (emptyCell) {
          if (this.player === 1) {
            square.style.backgroundImage = `url(${this.img_1})`;
            this.board[id] = 1;
            this.player = 2;
          } else {
            square.style.backgroundImage = `url(${this.img_2})`;
            this.board[id] = 2;
            this.player = 1;
          }
          this.verifyEndGame();
        }
      }
    }
  }

  getCharacters(name, numberList) {
    this.homeService.getCharacters(name).subscribe(
      response => {
        const responseList = response.data.results;
        this.listGetCharacters = responseList;
      },
      error => {
        console.log(error);
      }
    );
  }

  match(a, b, c) {
    if (this.board) {
      if (this.board[a] || this.board[b] || this.board[c]) {
        if (this.board[a] === this.board[b] && this.board[b] === this.board[c] ) {
          if (this.board[a] === 1 && this.firstCharacter) {
            this.winner = this.firstCharacter;
            this.firstScore++;
          } else {
            this.winner = this.secondCharacter;
            this.secondScore++;
          }
          return true;
        }
      }
    }
  }

  verifyEndGame() {
    if (this.match(1, 2, 3) || this.match(4, 5, 6) || this.match(7, 8, 9) ||
      this.match(1, 4, 7) || this.match(2, 5, 8) || this.match(3, 6, 9) ||
      this.match(1, 5, 9) || this.match(3, 5, 7)) {
        this.endGame = !this.endGame;
    } else if (this.busyHouses()) {
      this.endGame = !this.endGame;
      this.gameTie = !this.gameTie;
    }
  }

  newGame() {
    this.player = 1;
    this.board = [];
    this.winner = null;
    this.endGame = false;
    this.gameTie = false;

    for (let id = 1; id < 10; id++) {
      document.getElementById(`${id}`).style.backgroundImage = `none`;
    }
  }

  busyHouses() {
    let busyHouses = 0;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i]) {
        busyHouses++;
      }
    }
    return busyHouses === 9;
  }

}
