import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {MenuComponentModule} from "./menu/menu.module";

const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameComponentModule)
  },
  {
    path: '**',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuComponentModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
