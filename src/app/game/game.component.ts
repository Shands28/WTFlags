import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {GameDifficultyService} from "../services/game-difficulty.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {

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

  constructor(
    private gameDifficultyService: GameDifficultyService,
  ) {
    this.initializeGame();
  }

  initializeGame() {
    this.gameDifficultyService.getEasyCountriesList().subscribe((res: any) => {
      this.countries = res['countries'];
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
      if(this.attempts === 0){
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
    let hintedLettersAmount = this.flagSelected.name.length >= 9 ? 4 : 2;
    let hintedTextAux = "";
    this.flagSelected.name.split('').forEach((letter) => {
      if (hintedLettersAmount > 0 && letter !== " ") {
        console.log(hintedTextAux)
        if (Math.random() < 0.5) {
          hintedTextAux = hintedTextAux.concat("-");
        } else {
          hintedTextAux = hintedTextAux.concat(letter);
          hintedLettersAmount--;
        }
      } else if (letter === " ") {
        hintedTextAux = hintedTextAux.concat(" ");
      } else {
        hintedTextAux = hintedTextAux.concat("-");
      }
    })
    console.log(hintedTextAux, hintedLettersAmount)
    this.hintText = hintedTextAux.trim();
  }
}
