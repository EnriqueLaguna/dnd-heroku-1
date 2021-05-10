import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselVComponent } from './carousel-v.component';

describe('CarouselVComponent', () => {
  let component: CarouselVComponent;
  let fixture: ComponentFixture<CarouselVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselVComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
