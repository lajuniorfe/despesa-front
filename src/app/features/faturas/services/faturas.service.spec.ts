import { TestBed } from '@angular/core/testing';

import { FaturasService } from './faturas.service';

describe('FaturasService', () => {
  let service: FaturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
