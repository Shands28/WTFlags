import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameDifficultyService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCountriesList() {
    return this.http.get(`../../assets/countries_easy.json`)
  }

  getCountriesListByDifficulty(difficulty: string) {
    let countriesSources: Observable<any>[];
    if (difficulty === '3') {
      countriesSources = [
        this.http.get(`../../assets/countries_easy.json`),
        this.http.get(`../../assets/countries_medium.json`),
        this.http.get(`../../assets/countries_hard.json`),
        this.http.get(`../../assets/countries_veryhard.json`)
      ]
      return forkJoin(countriesSources).pipe(map(([easy, medium, hard, veryhard]: any[]) => easy.concat(medium).concat(hard).concat(veryhard)))
    } else if (difficulty === '2') {
      countriesSources = [
        this.http.get(`../../assets/countries_easy.json`),
        this.http.get(`../../assets/countries_medium.json`),
        this.http.get(`../../assets/countries_hard.json`)
      ]
      return forkJoin(countriesSources).pipe(map(([easy, medium, hard]: any[]) => easy.concat(medium).concat(hard)))
    } else if (difficulty === '1') {
      countriesSources = [
        this.http.get(`../../assets/countries_easy.json`),
        this.http.get(`../../assets/countries_medium.json`)
      ]
      return forkJoin(countriesSources).pipe(map(([easy, medium]: any[]) => easy.concat(medium)))
    } else {
      countriesSources = [
        this.http.get(`../../assets/countries_easy.json`)
      ]
      return forkJoin(countriesSources).pipe(map(([easy]: any[]) => easy))
    }
  }
}
