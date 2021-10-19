import { TestBed } from '@angular/core/testing';

import { ObjectSelectorService } from './object-selector.service';

describe('ObjectSelectorService', () => {
  let service: ObjectSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
