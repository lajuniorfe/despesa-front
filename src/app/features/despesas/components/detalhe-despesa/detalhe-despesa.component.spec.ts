import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheDespesaComponent } from './detalhe-despesa.component';

describe('DetalheDespesaComponent', () => {
  let component: DetalheDespesaComponent;
  let fixture: ComponentFixture<DetalheDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheDespesaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheDespesaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
