import {Component, OnInit, Optional} from '@angular/core';
import {App} from "@capacitor/app";
import {IonicModule, IonRouterOutlet, Platform} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterLink,
  ],
  template: `
    <div class="difficulty-container">
      <div>WTFlags</div>
      <mat-form-field class="select-container">
        <mat-label>Difficulty</mat-label>
        <mat-select (selectionChange)="changeDifficulty($event)" [value]="difficulty">
          <mat-option [value]="'0'">
            Easy
          </mat-option>
          <mat-option [value]="'1'">
            Medium
          </mat-option>
          <mat-option [value]="'2'">
            Hard
          </mat-option>
          <mat-option [value]="'3'">
            Very Hard
          </mat-option>
        </mat-select>
      </mat-form-field>
      <button mat-raised-button color="primary" [routerLink]="['game']">Start</button>
    </div>`,
  styles: [`
    .difficulty-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-top: 15vh;

      button, .select-container {
        width: clamp(300px, 50%, 600px);
      }

      div {
        font-size: 5em;
        margin-bottom: 30px;
        user-select: none;
        text-shadow: 3px 0 #f44336, -3px 0 #00e5e5, 0 3px #e0ac08, 0 -3px #2dd36f,
        2px 2px #f44336, -2px -2px #00e5e5, 2px -2px #e0ac08, -2px 2px #2dd36f;
      }
    }
  `],
})
export class MenuComponent implements OnInit {

  difficulty: string = '0';

  constructor(
    private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet!.canGoBack()) {
        App.exitApp();
      }
    });
  }

  ngOnInit() {
    this.difficulty = localStorage.getItem('difficulty') || '0';
  }

  changeDifficulty({value}: any) {
    localStorage.setItem('difficulty', value);
  }

}
