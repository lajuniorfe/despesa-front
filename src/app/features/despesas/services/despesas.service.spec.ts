import { TestBed } from '@angular/core/testing';

import { Despesas } from './despesas';

describe('Despesas', () => {
  let service: Despesas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Despesas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
