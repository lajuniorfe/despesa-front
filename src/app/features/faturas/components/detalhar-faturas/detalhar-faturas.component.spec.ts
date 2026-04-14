import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharFaturasComponent } from './detalhar-faturas.component';

describe('DetalharFaturasComponent', () => {
  let component: DetalharFaturasComponent;
  let fixture: ComponentFixture<DetalharFaturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharFaturasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalharFaturasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
