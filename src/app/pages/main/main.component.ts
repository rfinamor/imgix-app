import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, fromEvent, map} from 'rxjs';
import { constants } from 'src/app/constants';
import { ImageList } from 'src/app/interfaces/imageList';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  private API_IMAGES_URL = constants.API_IMAGES_URL;
  public imagesList: ImageList[] = [];
  public imageSelected: string = '';;
  public imageDefault: string = constants.DEFAULT_IMAGE_ROUTE;
  public rotateDegreesForm : FormGroup;
  public subscriptions = new Subscription();
  public defaultImageSelectedValue : string ;
  public rotationDegrees : number ;
  public lastDegrees : number[] = [] ;
  public brightness : number = 0 ;
  public contrast : number = 0 ;


  @ViewChild('submit',{ static: true }) submit! : ElementRef;

  constructor(private apiService : ApiService){
  }

  ngOnInit(): void {
      this.loadImages();
      this.rotateDegreesForm = new FormGroup({
        degrees: new FormControl(0,[
        Validators.required, Validators.min(0), Validators.max(359)]),
      })
  }

  ngAfterViewInit(): void {
    this.subscriptions = fromEvent<Event>(document.getElementById('button-submit') as HTMLElement, 'click').pipe(
      map((response) => {
        this.imageSelected = this.defaultImageSelectedValue;
        return this.imageSelected + constants.ROTATION_QUERY + this.rotationDegrees + constants.BRIGTHNESS_QUERY 
                + this.brightness + constants.CONTRAST_QUERY + this.contrast;
      }),
    ).subscribe(response => {
      this.imageSelected = response;
    }
     )
  }

  brightnessChange(e : any){
    this.brightness = e.target.value;
  }

  contrastChange(e : any){
    this.contrast = e.target.value;
  }

  undo(){//todo
  }

  redo(){//todo
  }

  submitChanges(){
    this.rotationDegrees = this.rotateDegreesForm.controls['degrees'].value;
  }

  loadImages(){
     this.apiService.get(this.API_IMAGES_URL)
    .pipe(
      map((response : ImageList[]) => response)
      ).subscribe((Response: ImageList[]) => this.imagesList = Response);
  }

  onSelected(imageUrl: string){
    this.imageSelected = imageUrl == constants.DEFAULT_IMAGE_STRING ? this.imageDefault : imageUrl;
    this.defaultImageSelectedValue = this.imageSelected;
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }
}