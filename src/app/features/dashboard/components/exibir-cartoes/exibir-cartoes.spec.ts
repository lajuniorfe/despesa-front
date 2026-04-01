import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirCartoes } from './exibir-cartoes';

describe('ExibirCartoes', () => {
  let component: ExibirCartoes;
  let fixture: ComponentFixture<ExibirCartoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExibirCartoes],
    }).compileComponents();

    fixture = TestBed.createComponent(ExibirCartoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
