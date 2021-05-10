import { Component, ComponentFactoryResolver, Input, OnInit, Output} from '@angular/core';
import { CharacterServiceService} from '../../shared/character-service.service';
import { Router, ActivatedRoute, Params} from '@angular/router';


interface inventory {
  objName: string | undefined,
  objLevel: number | undefined,
  objDesc: string | undefined
}

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.less']
})

export class CharacterDetailComponent implements OnInit {

  character: {
    id: number, 
    charName: string, 
    charClass: string,
    charRace: string
    charImage: string,
    charHp: number,
    charLevel: number,
    charInventory:inventory[]
  };

  constructor(
    private characterService: CharacterServiceService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    console.log('id: '+ id);
    this.characterService.getBaseChars().subscribe((char) => {
      this.character = char['characters'].find(ele => {
        return ele.id == id;
      });
    });


    this.route.params.subscribe((params: Params) => {
      id = +params['id'];
      this.characterService.getBaseChars().subscribe((char) => {
        this.character = char['characters'].find(ele => {
          return ele.id == id;
        });
        console.log(this.character);
        }
      );
    });

    
  }
}
