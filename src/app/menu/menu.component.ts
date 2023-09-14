import {Component, OnInit, Optional} from '@angular/core';
import {App} from "@capacitor/app";
import {IonRouterOutlet, Platform} from "@ionic/angular";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
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
