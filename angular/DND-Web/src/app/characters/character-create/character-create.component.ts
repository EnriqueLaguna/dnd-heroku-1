import { Component, OnInit } from '@angular/core';
import { CharacterServiceService } from '../../shared/character-service.service';

interface Inventory { 
  itemName: string | undefined,
  itemLevel: number | undefined,
  itemDescription: string | undefined
}

interface FormType {
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
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.less'],
  providers: [CharacterServiceService]
})

export class CharacterCreateComponent implements OnInit{

  characterForm: FormType = {
    id: undefined,
    name: undefined,
    class: undefined,
    race: undefined,
    hp: undefined,
    image: undefined,
    level: undefined,
    inventory: []
  }

  hpHigherThanZero: boolean = this.characterForm.hp > 0;
  levelHigherThanZero: boolean = this.characterForm.level > 0;
  canCreateChar: boolean;


  constructor(private characterService: CharacterServiceService){ }

  ngOnInit(): void {}

  hpChange() {
    this.hpHigherThanZero = this.characterForm.hp > 0;
    this.levelHigherThanZero = this.characterForm.level > 0
    this.canCreateChar = this.hpHigherThanZero && this.levelHigherThanZero;
  }
  createCharacter() {
    console.log(this.characterService.getBaseChars().subscribe(char => {
      //console.log(char);
    }));
    console.log('Characters Form:');
    console.log(this.characterForm);
    this.characterService.createCharacter(this.characterForm);
  }

}
