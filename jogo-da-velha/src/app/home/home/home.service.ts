import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class HomeService {

    private httpOptions;

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': '',
                'Content-Type': 'application/json'
            })
        };
    }

    getCharacters() {
        return '';
    }

}
