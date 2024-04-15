import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, distinctUntilChanged, filter, map, takeUntil, withLatestFrom } from 'rxjs';
import { environment } from './../../../../../../../environments/environment';
import { UploadImgModalComponent } from './../../../../../../page/use-cases-page/components/upload-img-modal/upload-img-modal.component';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { TermAndCondModalComponent } from './../../../../../../shared/components/term-and-cond-modal/term-and-cond-modal.component';
import { bidTermAndCond } from './../../../../../../shared/data/termAndCond';
import { StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidCreation } from './../../../../../../shared/interfaces/bid.interface';
import { selectCurrentNetwork } from './../../../../../../store/auth-store/state/selectors';
import { createBid } from './../../../../../../store/bid-store/state/actions';
import { selectBidCreation } from './../../../../../../store/bid-store/state/selectors';

@Component({
  selector: 'app-bid-creation',
  templateUrl: './bid-creation.component.html',
  styleUrls: ['./bid-creation.component.scss']
})
export class BidCreationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselExampleCaptions', { static: false }) carousel: ElementRef;
  @ViewChild('nextButton', { static: false }) nextButton: ElementRef<HTMLButtonElement>;
  @ViewChild('prevButton', { static: false }) prevButton: ElementRef<HTMLButtonElement>;

  imgList: string[] = [];
  imgLimit = 5;
  networkSupported: NetworkChainId[] = environment.contracts.bridgeTransfer.contracts.map((x) => x.chainId);
  networkList: INetworkDetail[] = [];

  headerPayload: IHeaderBodyPage = {
    title: $localize`:@@bidCreationHeaderTitle:Bid creation`,
    goBackLink: '/use-cases/bid/services',
    description: null
  };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  get bidCreationLoading$(): Observable<boolean> {
    return this.bidCreation$.pipe(map((state: StoreState<IBid | null>) => state.loading));
  }

  get bidCreationError$(): Observable<string | null> {
    return this.bidCreation$.pipe(map((state: StoreState<IBid | null>) => state.error));
  }

  mainForm = new FormGroup<BidForm>({
    bidName: new FormControl<string | null>(null, [Validators.required]),
    ownerName: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
    duration: new FormControl<number | null>(null, [Validators.required]),
    termsAndCond: new FormControl<boolean | null>(null, [Validators.requiredTrue]),
    networkChainId: new FormControl<NetworkChainId | null>(null, [Validators.required])
  });

  constructor(
    private readonly store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public web3LoginService: Web3LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  bidCreation$: Observable<StoreState<IBid | null>> = this.store.select(selectBidCreation);

  ngOnInit(): void {
    this.setUpForm();
    this.generateNetworkSupported();
  }

  generateNetworkSupported(): void {
    this.networkList = this.networkSupported.map((chainId: NetworkChainId) =>
      this.web3LoginService.getNetworkDetailByChainId(chainId)
    );
  }

  setUpForm(): void {
    this.mainForm
      .get('networkChainId')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        withLatestFrom(this.currentNetwork$),
        takeUntil(this.destroyed$),
        filter(([chainId]: [NetworkChainId | null, INetworkDetail | null]) => chainId !== null),
        map((payload) => payload as [NetworkChainId, INetworkDetail | null])
      )
      .subscribe(([chainId, network]: [NetworkChainId, INetworkDetail | null]) => {
        // reset error
        this.mainForm.get('networkChainId')?.clearValidators();
        this.mainForm.get('networkChainId')?.setValidators([Validators.required]);
        this.mainForm.get('networkChainId')?.updateValueAndValidity();

        if (chainId !== network?.chainId) {
          this.mainForm.get('networkChainId')?.setErrors({ notMatching: true });
        }

        if (!this.networkSupported.includes(chainId)) {
          this.mainForm.get('networkChainId')?.setErrors({ notSupported: true });
        }
      });
  }

  ngAfterViewInit(): void {
    this.currentNetwork$
      .pipe(
        takeUntil(this.destroyed$),
        filter((network: INetworkDetail | null) => network !== null),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => this.mainForm.get('networkChainId')?.setValue(network.chainId));

    this.cdr.detectChanges();
  }

  openImageDialog(): void {
    const dialogRef: MatDialogRef<UploadImgModalComponent> = this.dialog.open(UploadImgModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4']
    });

    const modalSub = dialogRef
      .afterClosed()
      .pipe()
      .subscribe((url: string | null) => {
        // URL does not exist
        if (!url) return;

        // URL already exists
        if (this.imgList.includes(url)) {
          this.snackBar.open(
            $localize`:@@bidCreation.ImageAlreadyAdded:Image already added`,
            $localize`:@@commonWords:Close`,
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
          return;
        }

        // Add URL to list
        this.imgList.push(url);
        this.prevButton?.nativeElement?.click();
        modalSub.unsubscribe();
      });
  }

  removeImageByUrl(url: string): void {
    const index: number = this.imgList.findIndex((photo: string) => photo === url);
    this.imgList.splice(index, 1);
    this.nextButton.nativeElement.click();
  }

  openTermAndCond(event: MouseEvent): MatDialogRef<TermAndCondModalComponent> {
    event.preventDefault();

    return this.dialog.open(TermAndCondModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-8'],
      data: bidTermAndCond,
      autoFocus: false
    });
  }

  createBid(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;

    if (this.imgList.length < 1) {
      this.snackBar.open(
        $localize`:@@bidCreation.PleaseAddAtLeastOneImage.:Please add at least one image`,
        $localize`:@@commonWords:Close`,
        {
          duration: 5000,
          panelClass: ['error-snackbar']
        }
      );
      return;
    }

    const { bidName, ownerName, description, duration } = this.mainForm.value;
    const payload: IBidCreation = {
      bidName: bidName as string,
      ownerName: ownerName as string,
      description: description as string,
      extendTimeInMinutes: 10,
      durationInMinutes: duration as number,
      imgLists: this.imgList,
      communityAddress: environment.communityAddress
    };

    return this.store.dispatch(createBid({ payload }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}

export interface BidForm {
  bidName: FormControl<string | null>;
  ownerName: FormControl<string | null>;
  description: FormControl<string | null>;
  duration: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
  networkChainId: FormControl<NetworkChainId | null>;
}
