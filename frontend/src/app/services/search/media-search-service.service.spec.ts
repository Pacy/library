import { TestBed } from '@angular/core/testing';

import { MediaSearchService } from './media-search-service.service';

describe('MediaSearchService', () => {
  let service: MediaSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
