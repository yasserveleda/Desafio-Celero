import { Component, OnInit, HostListener } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private characters: any[];
  private img_1 = `./assets/img/1.png`;
  private img_2 = `./assets/img/2.png`;
  private player = 1;
  private tabuleiro = [];
  private vencedor;
  private endGame = false;

  constructor(private homeService: HomeService) {
    // console.log(this.homeService.getCharacters());
  }

  ngOnInit() {
    // teste
    // this.getCharacters('iron');
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (!this.endGame) {
      if (`casa` === event.target.className) {
        const id = event.target.id;
        if (this.player === 1) {
          document.getElementById(id).style.backgroundImage = `url(${this.img_1})`;
          this.tabuleiro[id] = 1;
          console.log(this.tabuleiro.length);
          this.player = 2;
          this.verificarFimDeJogo();
        } else {
          document.getElementById(id).style.backgroundImage = `url(${this.img_2})`;
          this.tabuleiro[id] = 2;
          console.log(this.tabuleiro.length);
          this.player = 1;
          this.verificarFimDeJogo();
        }
      }
    } else {
      console.log(`Fim de Jogo`);
    }
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
