import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  translateService: TranslateService = inject(TranslateService);

  constructor() {
  }

  ngOnInit(): void {
    let localLang = localStorage.getItem('lang');
    if (localLang) {
      this.translateService.setDefaultLang(localLang);
    } else {
      let browserLang = this.translateService.getBrowserLang();
      localStorage.setItem('lang', browserLang || 'en');
      this.translateService.setDefaultLang(browserLang || 'en');
    }
  }
}
