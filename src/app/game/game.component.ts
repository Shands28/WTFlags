import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameDifficultyService} from "../shared/services/game-difficulty.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, Observable, startWith} from "rxjs";
import {Platform, IonicModule} from "@ionic/angular";
import {MatOptionModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {NgStyle, NgIf, NgFor, AsyncPipe} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Country} from "../shared/interfaces/country";
import {FlagComponent} from "../shared/components/flag/flag.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgFor,
    MatOptionModule,
    IonicModule,
    RouterLink,
    AsyncPipe,
    TranslateModule,
    FlagComponent,
  ],
})
export class GameComponent implements OnInit {

  translateService: TranslateService = inject(TranslateService);
  gameDifficultyService: GameDifficultyService = inject(GameDifficultyService);
  route: ActivatedRoute = inject(ActivatedRoute);
  platform: Platform = inject(Platform);
  countries: Country[] = []
  maxCumulativeWeight: number = 0;
  guessCountryControl = new FormControl({value: '', disabled: true}, [Validators.required]);
  flagSelected: Country;
  attempts: number = 0;
  hintAmount: number = 3;
  hintText: string = "";
  hintGivenThisRound: boolean = false;
  totalAmountOfFlags: number = 0;
  filteredOptions: Observable<string[]> = new Observable<string[]>();
  keyboardOut: boolean = false;
  gameStart: boolean = false;

  constructor() {
    this.route.params.subscribe(() => {
      this.initializeGame();
    })
    this.platform.keyboardDidShow.subscribe(() => {
      this.keyboardOut = true
    });
    this.platform.keyboardDidHide.subscribe(() => {
      this.keyboardOut = false
    });
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
      this.gameStart = true;
    });
  }

  generateWeights() {
    for (let i = 0; i < this.countries.length; i++) {
      this.countries[i].cumulativeWeight = this.countries[i].weight + (this.countries[i - 1] ? this.countries[i - 1].cumulativeWeight! : 0);
    }
    this.maxCumulativeWeight = this.countries[this.countries.length - 1].cumulativeWeight!;
  }

  selectFlag(): Country {
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

  guessFlag() {
    let correctCountryName: string = this.translateService.instant(this.flagSelected.country_code);
    console.log(this.guessCountryControl.value?.toLowerCase(), this.flagSelected.name.toLowerCase(), correctCountryName.toLowerCase())
    if (this.guessCountryControl.valid) {
      if (this.guessCountryControl.value?.toLowerCase().trim() !== correctCountryName.toLowerCase().trim()) {
        console.log('err')
        this.guessCountryControl.reset('');
        this.guessCountryControl.setErrors({'incorrect': true});
        this.attempts--
        if (this.attempts === 0) {
          this.guessCountryControl.disable();
          this.hintText = correctCountryName
        }
      } else {
        this.guessCountryControl.reset('');
        this.extractCorrectFlag();
        if (this.countries.length > 0) {
          this.selectFlag();
        }
        this.hintText = "";
        this.hintGivenThisRound = false;
        console.log(this.flagSelected)
      }
    }
  }

  generateHint() {
    let correctCountryName: string = this.translateService.instant(this.flagSelected.country_code);
    this.hintGivenThisRound = true;
    this.hintAmount--;
    let hintChance: number = 3;
    let hintChanceTotal: number = 0.5;
    let hintedLettersAmount: number = correctCountryName.length >= 9 ? 4 : 2;
    let hintedTextAux: string = "";
    correctCountryName.split('').forEach((letter: string) => {
      if (hintedLettersAmount > 0 && letter !== " ") {
        let chance: number = Math.random() * 10;
        if (chance > hintChanceTotal) {
          if (hintedLettersAmount === correctCountryName.length - hintedTextAux.length) {
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
    if (filterValue.length >= 2) {
      return this.countries.map(country => this.translateService.instant(country.country_code)).filter(option => option.toLowerCase().includes(filterValue))
    } else {
      return []
    }
  }
}
