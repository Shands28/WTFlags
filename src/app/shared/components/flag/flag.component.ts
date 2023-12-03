import {Component, Input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Country} from "../../interfaces/country";

@Component({
  selector: 'app-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
  imports: [
    TranslateModule
  ],
  standalone: true
})
export class FlagComponent {

  @Input({required: true}) flagSelected: Country;

  constructor() {
  }

}
