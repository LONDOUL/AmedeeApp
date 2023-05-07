import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ClasseComponent } from './classe/classe.component';

const routes: Routes = [
  { path: 'classes', component: ClasseComponent},
  { path: '', component: AppComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
