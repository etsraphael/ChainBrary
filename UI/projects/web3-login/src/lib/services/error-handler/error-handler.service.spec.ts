import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { ErrorHandlerService } from './error-handler.service';
import { snackbarMock } from '../../../../../../src/app/shared/tests/modules/modules.mock';

describe('PriceFeedService', () => {
  let errorHandlerService: ErrorHandlerService;

  beforeEach(() => {
    errorHandlerService = new ErrorHandlerService(snackbarMock);
  });

  it('should be created', () => {
    expect(errorHandlerService).toBeTruthy();
  });
});
