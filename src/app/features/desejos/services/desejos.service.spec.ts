import { TestBed } from '@angular/core/testing';

import { DesejosService } from './desejos.service';

describe('DesejosService', () => {
  let service: DesejosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesejosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
