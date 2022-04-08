import { TestBed } from '@angular/core/testing';

import { MediaService as MediaService } from './media.service';

describe('MediaSearchService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
