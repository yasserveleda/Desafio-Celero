import { Component, OnInit, HostListener } from '@angular/core';
import { HomeService } from './home.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

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
  tabuleiro = [];
  vencedor;
  endGame = false;
  firstCharacter;
  secondCharacter;
  public model: any;

  private statesWithFlags: {name: string, flag: string}[] = [
    {'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},
    {'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},
    {'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},
    {'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},
    {'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},
    {'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},
    {'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},
    {'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},
    {'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},
    {
      'name': 'Georgia',
      'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'
    },
    {'name': 'Hawaii', 'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},
    {'name': 'Idaho', 'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},
    {'name': 'Illinois', 'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},
    {'name': 'Indiana', 'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},
    {'name': 'Iowa', 'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},
    {'name': 'Kansas', 'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},
    {'name': 'Kentucky', 'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},
    {'name': 'Louisiana', 'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},
    {'name': 'Maine', 'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},
    {'name': 'Maryland', 'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},
    {'name': 'Massachusetts', 'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},
    {'name': 'Michigan', 'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},
    {'name': 'Minnesota', 'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},
    {'name': 'Mississippi', 'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},
    {'name': 'Missouri', 'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},
    {'name': 'Montana', 'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},
    {'name': 'Nebraska', 'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},
    {'name': 'Nevada', 'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},
    {'name': 'New Hampshire', 'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},
    {'name': 'New Jersey', 'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},
    {'name': 'New Mexico', 'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},
    {'name': 'New York', 'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},
    {'name': 'North Carolina', 'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},
    {'name': 'North Dakota', 'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},
    {'name': 'Ohio', 'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},
    {'name': 'Oklahoma', 'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},
    {'name': 'Oregon', 'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},
    {'name': 'Pennsylvania', 'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},
    {'name': 'Rhode Island', 'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},
    {'name': 'South Carolina', 'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},
    {'name': 'South Dakota', 'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},
    {'name': 'Tennessee', 'flag': '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},
    {'name': 'Texas', 'flag': 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},
    {'name': 'Utah', 'flag': 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},
    {'name': 'Vermont', 'flag': '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},
    {'name': 'Virginia', 'flag': '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},
    {'name': 'Washington', 'flag': '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},
    {'name': 'West Virginia', 'flag': '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},
    {'name': 'Wisconsin', 'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},
    {'name': 'Wyoming', 'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}
  ];  

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.statesWithFlags.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: {name: string}) => x.name;

  test () {
    console.log('FOI TEST'); 
  }

  constructor(private homeService: HomeService) {
    // console.log(this.homeService.getCharacters());
  }

  ngOnInit() {
    // teste
    // this.getCharacters('iron');
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

  public searchCharacters(character) {
    console.log(character);
    if (this.firstCharacter) {
      this.getCharacters(this.firstCharacter);
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
