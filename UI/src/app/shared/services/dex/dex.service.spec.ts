import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedComponentsModule } from '../../components/shared-components.module';
import { DexService } from './dex.service';

describe('DexService', () => {
  let service: DexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsModule, StoreModule.forRoot({})],
      providers: [{ provide: 'config', useValue: {} }]
    });
    service = TestBed.inject(DexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
