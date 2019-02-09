import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

export interface Marvel {
    data: {
        results: any;
    };
}
@Injectable({
  providedIn: 'root'
})
export class HomeService {

    public httpOptions;
    private _marvelCharacterUrl = `https://gateway.marvel.com:443/v1/public/characters`;
    private _publicKey = `0dcf696ba0e5bd3552a5176656c9e5ac`;
    private _privateKey = `18076b2127cc25c9be2f2f30f8b40dd4b0c0afd4`;

    constructor(public http: HttpClient) {
      this.httpOptions = {
        headers: new HttpHeaders({
          // 'Content-Type': 'application/xml',
          // 'Accept': 'application/xml'
        })
      };
    }

    private getHash(timeStamp) {
        const md5 = new Md5();
        md5.appendStr(timeStamp);
        md5.appendStr(this._privateKey);
        md5.appendStr(this._publicKey);
        const hash = md5.end().toString();
        return hash;
    }

    private getTimeStamp() {
        return new Date().valueOf().toString();
    }

    public getCharacters(name) {
        const timeStamp = this.getTimeStamp();
        const hash = this.getHash(timeStamp);
        const limit = 10;
        let url = `${this._marvelCharacterUrl}?limit=${limit}&ts=${timeStamp}&apikey=${this._publicKey}&hash=${hash}`;
        if (name) {
            url += `&nameStartsWith=${name}`;
        }
        return this.http.get<Marvel>(url);
    }
}
