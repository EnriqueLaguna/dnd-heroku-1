import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { CharacterServiceService} from '../shared/character-service.service';
import { AuthService } from '../shared/authService';
import { HttpEvent } from '@angular/common/http';


@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.less']
})

export class CharactersComponent implements OnInit {

  characters_array:any[] = [];
  user: SocialUser | null;

  constructor(private router: Router, private characterService: CharacterServiceService, private authService:AuthService) { }

  routeToCharacterId(id: number){
    this.router.navigate(['/characters/' + id]);
  }

  ngOnInit(): void {
    //this.characters_array = this.characterService.getCharacters();
    this.getBaseCharacters();
    this.getThisUser();
  }
  getAllCharacters(): void{
    this.characterService.getUsers().subscribe((res) => {
      const { character } = res['content'][0];
      const characters = new Array;
      console.log(Object.values(res['content']).forEach(obj => {
        characters.push(obj['characters']);
      }));
      return characters[4];
    });
  }

  getBaseCharacters():void{
    this.characterService.getBaseChars().subscribe((char) => {
     this.characters_array = char['characters'];
    })
  }

  getThisUser(){
    this.user = this.authService.getUser();
    //console.log('Characters Component');
    //console.log(this.user);
  }

  deleteChar(event: any){
    console.log(event.target.getAttribute("data-charid"));

    let id = event.target.getAttribute("data-charid");
    this.characterService.deleteCharSer(id);

  }
}
