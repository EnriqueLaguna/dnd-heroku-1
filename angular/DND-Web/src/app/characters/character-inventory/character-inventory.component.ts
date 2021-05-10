import { Component, OnInit, Input } from '@angular/core';
import { CharacterServiceService } from '../../shared/character-service.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


interface inventory {
  objName: string | undefined,
  objLevel: number | undefined,
  objDesc: string | undefined
}
@Component({
  selector: 'app-character-inventory',
  templateUrl: './character-inventory.component.html',
  styleUrls: ['./character-inventory.component.less']
})

export class CharacterInventoryComponent implements OnInit {

  charInventory : inventory[];

  @Input() item: inventory[];

  constructor() { }

  ngOnInit(): void {
    //console.log('Inventory');
    //console.log(this.item);
    this.charInventory = this.item;
    //console.log('Variable de inventario: ' + this.charInventory)
  }
}
