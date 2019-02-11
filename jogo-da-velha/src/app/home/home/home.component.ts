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

  constructor(private homeService: HomeService) {
    // this.getCharacters(``);
  }

  characters: any[];
  img_1 = `./assets/img/1.png`;
  img_2 = `./assets/img/2.png`;
  player = 1;
  tabuleiro = [];
  vencedor;
  endGame = false;

  // First Character
  firstCharacter;
  firstModelCharacter;
  firstSelected;
  firstImagePath;
  firstListCharacter = [];

  // Second Character
  secondCharacter;
  secondModelCharacter;
  secondSelected;
  secondImagePath;
  secondListCharacter = [];

  ngOnInit() { }

  search = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => {
        if (this.secondModelCharacter && this.secondModelCharacter.length >= 3) {
          this.getCharacters(this.secondModelCharacter);
        }
      }),
      debounceTime(500),
      map(term => term === '' ? []
        : this.secondListCharacter.filter(v => v.name))
    )

  formatter = (x: {name: string}) => x.name;

  characterSelect (event) {
    if (event && event.item) {
      this.secondCharacter = event.item;
      this.secondSelected = true;
      this.secondImagePath = `${this.secondCharacter.thumbnail.path}.${this.secondCharacter.thumbnail.extension}`;
    }
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    // verifica se o click é no tabuleiro
    if (`casa` === event.target.className) {
      // Verifica se a partida esta em jogo
      if (!this.endGame) {
        const id = event.target.id;
        const square = document.getElementById(id);
        // verifica se o espaco esta vago
        if (!square.style.backgroundImage || square.style.backgroundImage === `none`) {
          // verifica o jogador
          if (this.player === 1) {
            square.style.backgroundImage = `url(${this.img_1})`;
            this.tabuleiro[id] = 1;
            // console.log(this.tabuleiro.length);
            this.player = 2;
          } else {
            square.style.backgroundImage = `url(${this.img_2})`;
            this.tabuleiro[id] = 2;
            // console.log(this.tabuleiro.length);
            this.player = 1;
          }
          // verifica o termino da partida
          this.verificarFimDeJogo();
        }
      } else {
        console.log(`Fim de Jogo`);
      }
    }
  }

  searchCharacters(character) {
    if (this.firstCharacter) {
      this.getCharacters(this.firstCharacter);
    }
  }

  getCharacters(name) {
    console.log(name);
    this.homeService.getCharacters(name).subscribe(
      response => {
        // console.log(response);
        const responseList = response.data.results;
        console.log(responseList);
        this.secondListCharacter = responseList;
        // responseList.map(function(item) {
        //   console.log(item.name);
        // });
      },
      error => {
        // Usar dados mock em ambiente local
        console.log(error);
      }
    );
  }

  casasIguais(a, b, c) {
    if (this.tabuleiro) {
      if (this.tabuleiro[a] || this.tabuleiro[b] || this.tabuleiro[c]) {
        if (this.tabuleiro[a] === this.tabuleiro[b] && this.tabuleiro[b] === this.tabuleiro[c] ) {
          if (this.tabuleiro[a] === 1) {
            this.vencedor = 1;
          } else {
            this.vencedor = 2;
          }
          return true;
        }
      }
    }
  }

  verificarFimDeJogo() {
    if (this.casasIguais(1, 2, 3) || this.casasIguais(4, 5, 6) || this.casasIguais(7, 8, 9) ||
      this.casasIguais(1, 4, 7) || this.casasIguais(2, 5, 8) || this.casasIguais(3, 6, 9) ||
      this.casasIguais(1, 5, 9) || this.casasIguais(3, 5, 7)) {
        this.endGame = !this.endGame;
        alert(`Parabens Player: ${this.vencedor}`);
    }
    // if (this.tabuleiro.length === 10) {
    //   alert(`DEU VEIA`);
    // }
  }

  newGame() {
    console.log(`NOVO JOGOOOO`);
    this.player = 1;
    this.tabuleiro = [];
    this.vencedor = null;
    this.endGame = false;

    for (let id = 1; id < 10; id++) {
      document.getElementById(`${id}`).style.backgroundImage = `none`;
    }
  }

}
