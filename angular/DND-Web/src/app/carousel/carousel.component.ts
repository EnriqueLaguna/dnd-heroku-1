import { Component, Input, OnInit } from '@angular/core';

function test(a:Number) {
  console.log(a);
  return true
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.less']
})

export class CarouselComponent implements OnInit {
  @Input() test:string = 'default';
  constructor() { }

  ngOnInit(): void {
  }

}
