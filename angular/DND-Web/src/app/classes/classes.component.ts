import { Component, OnInit } from '@angular/core';
import { ClassService } from '../shared/class.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.less']
})
export class ClassesComponent implements OnInit {

  classes = ['Barbarian', '2', '3'];

  constructor(private classService: ClassService) { }

  ngOnInit(): void {
    this.classService.getClass().subscribe((res) => {
      console.log(res);
    });
  }

  
  

}
