import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameDifficultyService {

  constructor(
    private http: HttpClient
  ) {
  }

  getEasyCountriesList() {
    return this.http.get(`../../assets/countries_easy.json`)
  }
}
