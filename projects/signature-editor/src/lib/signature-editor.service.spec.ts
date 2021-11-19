import { TestBed } from '@angular/core/testing';

import { SignatureEditorService } from './signature-editor.service';

describe('SignatureEditorService', () => {
  let service: SignatureEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignatureEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
