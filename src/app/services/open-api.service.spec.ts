import { TestBed } from '@angular/core/testing';

import { OpenAPIService } from './open-api.service';

describe('OpenAPIService', () => {
  let service: OpenAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
