import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {GameDifficultyService} from "../services/game-difficulty.service";
import {ActivatedRoute} from "@angular/router";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  countries: { name: string; weight: number, cumulativeWeight?: number, country_code: string }[] = []
  maxCumulativeWeight: number = 0;
  guessCountryControl = new FormControl({value: '', disabled: false});
  flagSelected = {
    name: '',
    weight: 0,
    country_code: ''
  };
  attempts: number = 0;
  hintAmount: number = 3;
  hintText: string = "";
  hintGivenThisRound: boolean = false;
  totalAmountOfFlags: number = 0;
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  constructor(
    private gameDifficultyService: GameDifficultyService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(() => {
      this.initializeGame();
    })
  }

  ngOnInit() {
    this.filteredOptions = this.guessCountryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  initializeGame() {
    this.gameDifficultyService.getCountriesListByDifficulty(localStorage.getItem('difficulty') || '0').subscribe((res: any) => {
      this.countries = res;
      this.totalAmountOfFlags = this.countries.length;
      console.log(this.countries)
      this.generateWeights()
      this.selectFlag()
      console.log(this.flagSelected)
      this.attempts = 3;
      this.hintAmount = 3;
      this.hintGivenThisRound = false;
      this.hintText = "";
      this.guessCountryControl.enable();
    });
  }

  generateWeights() {
    for (let i = 0; i < this.countries.length; i++) {
      this.countries[i].cumulativeWeight = this.countries[i].weight + (this.countries[i - 1] ? this.countries[i - 1].cumulativeWeight! : 0);
    }
    this.maxCumulativeWeight = this.countries[this.countries.length - 1].cumulativeWeight!;
  }

  selectFlag() {
    let randomWeightedNumber = this.maxCumulativeWeight * Math.random();
    console.log('randomWeightedNumber', randomWeightedNumber);
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].cumulativeWeight! >= randomWeightedNumber) {
        return this.flagSelected = this.countries[i];
      }
    }
    return this.countries[0];
  }

  extractCorrectFlag() {
    console.log('before', this.countries.length)
    let flagToBeDeletedIndex: number = -1;
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].name === this.flagSelected.name) {
        flagToBeDeletedIndex = i;
      }
    }
    if (flagToBeDeletedIndex >= 0) {
      this.countries.splice(flagToBeDeletedIndex, 1)
    }
    if (this.countries.length > 0) {
      this.generateWeights()
      console.log('this.maxCumulativeWeight', this.maxCumulativeWeight)
      console.log('after', this.countries.length)
      console.log(this.countries)
    }
  }

  guessFlag(event: SubmitEvent | MouseEvent) {
    event.preventDefault();
    console.log(this.guessCountryControl.value?.toLowerCase(), this.flagSelected.name.toLowerCase())
    if (this.guessCountryControl.value?.toLowerCase().trim() !== this.flagSelected.name.toLowerCase().trim()) {
      console.log('err')
      this.guessCountryControl.reset();
      this.guessCountryControl.setErrors({'incorrect': true});
      this.attempts--
      if (this.attempts === 0) {
        this.guessCountryControl.disable();
      }
    } else {
      this.guessCountryControl.reset();
      this.extractCorrectFlag();
      if (this.countries.length > 0) {
        this.selectFlag();
      }
      this.hintText = "";
      this.hintGivenThisRound = false;
      console.log(this.flagSelected)
    }
  }

  generateHint() {
    this.hintGivenThisRound = true;
    this.hintAmount--;
    let hintChance = 3;
    let hintChanceTotal = 0.5;
    let hintedLettersAmount = this.flagSelected.name.length >= 9 ? 4 : 2;
    let hintedTextAux = "";
    this.flagSelected.name.split('').forEach((letter) => {
      if (hintedLettersAmount > 0 && letter !== " ") {
        let chance = Math.random()*10;
        if (chance > hintChanceTotal) {
          if(hintedLettersAmount === this.flagSelected.name.length - hintedTextAux.length) {
            hintedTextAux = hintedTextAux.concat(letter);
            hintedLettersAmount--;
          } else {
            hintedTextAux = hintedTextAux.concat("-");
            hintChanceTotal += hintChance;
          }
        } else {
          hintChanceTotal = hintChance;
          hintedTextAux = hintedTextAux.concat(letter);
          hintedLettersAmount--;
        }
      } else if (letter === " ") {
        hintedTextAux = hintedTextAux.concat(" ");
      } else {
        hintedTextAux = hintedTextAux.concat("-");
      }
    })
    this.hintText = hintedTextAux.trim();

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if(filterValue.length >= 2) {
      return this.countries.map(country => country.name).filter(option => option.toLowerCase().includes(filterValue))
    }
    else {
      return []
    }
  }
}
