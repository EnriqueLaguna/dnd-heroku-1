import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharactersComponent } from './characters/characters.component';
import { RacesComponent } from './races/races.component';
import { ClassesComponent } from './classes/classes.component';
import { LoginComponent } from './login/login.component';
import { DiceRollComponent } from './dice-roll/dice-roll.component';
import { ClassDetailComponent } from './classes/class-detail/class-detail.component';
import { RaceDetailComponent } from './races/race-detail/race-detail.component';
import { CharacterDetailComponent } from './characters/character-detail/character-detail.component';
import { RegisterComponent } from './login/register/register.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselVComponent } from './carousel-v/carousel-v.component';
import { CharacterCreateComponent } from './characters/character-create/character-create.component';
import { CharacterInventoryComponent } from './characters/character-inventory/character-inventory.component';

import { AuthService } from './shared/authService';
import { AuthGuardService } from './shared/authguard';
import { CharacterModifyComponent } from './characters/character-modify/character-modify.component';

@NgModule({
  declarations: [
    AppComponent,
    CharactersComponent,
    RacesComponent,
    ClassesComponent,
    LoginComponent,
    DiceRollComponent,
    ClassDetailComponent,
    RaceDetailComponent,
    CharacterDetailComponent,
    RegisterComponent,
    CarouselComponent,
    CarouselVComponent,
    CharacterCreateComponent,
    CharacterInventoryComponent,
    CharacterModifyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('811390821632-s34ecq4murm16e21ip2kshgs2jb4aftg.apps.googleusercontent.com')
        }
      ]
    } as SocialAuthServiceConfig
  },
    AuthService,
    AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
