import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'game',
    loadComponent: () => import('./game/game.component').then(m => m.GameComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
