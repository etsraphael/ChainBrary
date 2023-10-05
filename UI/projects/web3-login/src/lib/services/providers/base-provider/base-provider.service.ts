import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { PrivateGlobalValuesService } from '../../global-values/private-global-values.service';
import { PublicGlobalValuesService } from '../../global-values/public-global-values.service';
import { NetworkServiceWeb3Login } from '../../network/network.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseProviderService {
  constructor(
    protected errorHandlerService: ErrorHandlerService,
    protected networkService: NetworkServiceWeb3Login,
    protected deviceService: DeviceDetectorService,
    protected router: Router,
    protected privateGlobalValuesService: PrivateGlobalValuesService,
    protected publicGlobalValuesService: PublicGlobalValuesService
  ) {}

  abstract logInWithWallet(): void;
  abstract onAccountChangedEvent(): Observable<string | undefined>
}
