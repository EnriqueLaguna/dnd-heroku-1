import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CharacterServiceService } from '../../shared/character-service.service';
import { AuthService } from '../../shared/authService';
import { SocialUser } from 'angularx-social-login';
import { Router, ActivatedRoute, Params} from '@angular/router';

interface Inventory { 
  itemName: string | undefined,
  itemLevel: number | undefined,
  itemDescription: string | undefined
}

interface Character {
  id: number | undefined,
  name: string | undefined,
  class: string | undefined,
  race: string | undefined,
  hp: number | undefined,
  image: string | undefined,
  level: number | undefined,
  inventory: Inventory[]| undefined
}

@Component({
  selector: 'app-character-modify',
  templateUrl: './character-modify.component.html',
  styleUrls: ['./character-modify.component.less'],
  providers: [CharacterServiceService]
})
export class CharacterModifyComponent implements OnInit {

  oldChar: Character | null;
  oldCharId: number;
  user: SocialUser | null;

  charArray: Character[] | null;

  newChar: Character | null;

  name: string;
  clase: any;
  raza: string;
  hp: number;
  nivel: number;

  constructor(private characterService: CharacterServiceService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getThisUser();
    this.getOldChar();
  }

  onChange(property: string, event: Event){
    this[property] = (<HTMLInputElement>event.target).value;
  }

  getThisUser(){
    this.user = this.authService.getUser();
    //console.log(this.user);
  }
  getOldChar(){
    this.oldCharId = +this.route.snapshot.params['id'];
    //console.log('old char id: ' + this.oldCharId);

    this.characterService.getBaseChars().subscribe(data => {
      this.charArray = data['characters'];
      this.oldChar = data['characters'].find(ele => {
        return ele.id == this.oldCharId;
      });
      this.newChar = this.oldChar;
      
      //Asignar los valores del viejo personaje a los atributos del nuevo
      this.name = this.oldChar['charName'];
      this.clase = this.oldChar['charClass'];
      this.raza = this.oldChar['charRace'];
      this.hp = this.oldChar['charHp'];
      this.nivel = this.oldChar['charLevel'];
      
    });
  }

  updateChar(){
    //console.log(this.newChar);
    //console.log(this.name, this.raza, this.clase, this.hp, this.nivel);

    //Actualizar los valores en el nuevo personaje
    this.newChar['charName'] = this.name;
    this.newChar['charRace'] = this.raza;
    this.newChar['charClass'] = this.clase;
    this.newChar['charHp'] = this.hp;
    this.newChar['charLevel'] = this.nivel;

    //console.log(this.newChar);

    //Actualizar el personaje en el arreglo de personajes
    this.charArray.forEach(ele => {
      if(ele.id = this.newChar.id){
        ele = this.newChar;
      }
    });
    this.characterService.updateCharacter(this.newChar, this.user.email);
    
  }
}
