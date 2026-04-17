import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCategoriaComponent } from './relatorio-categoria.component';

describe('RelatorioCategoriaComponent', () => {
  let component: RelatorioCategoriaComponent;
  let fixture: ComponentFixture<RelatorioCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioCategoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioCategoriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
