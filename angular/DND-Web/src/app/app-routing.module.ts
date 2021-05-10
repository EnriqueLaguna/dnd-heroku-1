import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharactersComponent } from './characters/characters.component';
import { CharacterCreateComponent } from './characters/character-create/character-create.component';
import { ClassesComponent } from './classes/classes.component';
import { DiceRollComponent } from './dice-roll/dice-roll.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { RacesComponent } from './races/races.component';
import { CharacterDetailComponent } from './characters/character-detail/character-detail.component';
import { CharacterInventoryComponent } from './characters/character-inventory/character-inventory.component';
import { CharacterModifyComponent }  from './characters/character-modify/character-modify.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'dices',
    component: DiceRollComponent
  },
  {
    path: 'characters', 
    component: CharactersComponent, children: [
      {
        path: ':id', 
        component: CharacterDetailComponent
      },
      {
        path: 'inventory',
        component: CharacterInventoryComponent
      }
    ]
  },
  {
    path: 'classes', 
    component: ClassesComponent
  },
  {
    path: 'races',
    component: RacesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'character-create',
    component: CharacterCreateComponent   
  },
  {
    path: 'character-modify', children :[
      {
        path: ':id',
        component: CharacterModifyComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
