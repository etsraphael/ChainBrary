import { ComponentFixture, TestBed } from '@angular/core/testing';
import { INetworkDetail, NetworkChainId, NetworkVersion, TokenId } from '@chainbrary/web3-login';
import { Observable } from 'rxjs';
import {
  ActionStoreProcessing,
  DocumentLockerRole,
  IDocumentLockerResponse
} from './../../../../../../shared/interfaces';
import { unlockDocumentSuccess } from './../../../../../../store/document-locker-store/state/actions';
import { DocumentLockerContentComponent } from './document-locker-content.component';

describe('DocumentLockerContentComponent', () => {
  let component: DocumentLockerContentComponent;
  let fixture: ComponentFixture<DocumentLockerContentComponent>;

  const documentLockerContent: IDocumentLockerResponse = {
    conctractAddress: '',
    documentName: '',
    ownerName: '',
    price: 1,
    ownerAddress: '',
    accessAddress: ''
  };

  const currentNetwork: INetworkDetail = {
    chainId: NetworkChainId.ETHEREUM,
    networkVersion: NetworkVersion.ETHEREUM,
    name: '',
    shortName: '',
    nativeCurrency: {
      id: TokenId.ETHEREUM,
      name: '',
      symbol: '',
      decimals: 18
    },
    blockExplorerUrls: ''
  };

  const hasAccessAs: DocumentLockerRole = DocumentLockerRole.NONE;

  const unlockIsProcessing: ActionStoreProcessing = {
    isLoading: false,
    errorMessage: null
  };

  const unlockDocumentSuccessTriggerObs: Observable<ReturnType<typeof unlockDocumentSuccess>> = new Observable<
    ReturnType<typeof unlockDocumentSuccess>
  >();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLockerContentComponent]
    });
    fixture = TestBed.createComponent(DocumentLockerContentComponent);
    component = fixture.componentInstance;
    component.documentLockerContent = documentLockerContent;
    component.currentNetwork = currentNetwork;
    component.hasAccessAs = hasAccessAs;
    component.unlockIsProcessing = unlockIsProcessing;
    component.unlockDocumentSuccessTriggerObs = unlockDocumentSuccessTriggerObs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
