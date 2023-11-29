import {Component, inject, OnInit, Optional} from '@angular/core';
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
import {TranslateModule, TranslateService} from "@ngx-translate/core";

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
    TranslateModule,
  ],
  templateUrl: "menu.component.html",
  styleUrl: "menu.component.scss"
})
export class MenuComponent implements OnInit {

  translateService: TranslateService = inject(TranslateService);
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

  changeLang(lang: string) {
    console.log(lang)
    this.translateService.use(lang)
    localStorage.setItem('lang', lang);
  }
}
