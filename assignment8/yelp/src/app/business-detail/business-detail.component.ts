import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { GoogleMapsModule } from "@angular/google-maps";
import axios from "axios";
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {StorageService} from "../services/storage.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessDetailComponent implements OnInit {

  businessDetail:any;
  businessReviews:any;

  // details
  name = '';
  address = ' ';
  category = ' ';
  phone = ' ';
  price = ' ';
  status = ' ';
  link = ' ';
  photos = ['', '', ''];

  twitter = ' ';

  // reservation
  isReserved:boolean = false;

  // map
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
  }

  markers: {position: {lat: number, lng: number}}[] = [{
    position: {
      lat: 38.9987208, lng: -77.2538699,
    }
  }];

  constructor(private router: Router,
              private storage: StorageService,
              private datePipe: DatePipe) {}

  @Input()
  businessId?:string

  @Input()
  isShow?:any

  @Output() sendStatus = new EventEmitter();

  async ngOnChanges() {
    if(this.businessId && !this.isShow.reset) {
      await this.showDetails();
      this.doSearch();
      (document.getElementById('business_detail') as HTMLElement).style.display = 'block';
    } else {
      (document.getElementById('business_detail') as HTMLElement).style.display = 'none';
    }
  }

  minDate: string = '';

  ngOnInit() {
    const date = new Date();
    this.minDate = this.datePipe.transform(date,"yyyy-MM-dd") as string;

    // subscribe the value change
    this.email.valueChanges.subscribe(
      res => {
        this.checkEmailValid();
      }
    )
  }

  // check the email valid or not -> change the error message
  checkEmailValid() {
    if(this.email.value == ''){
      (document.getElementById('emailInvalid') as HTMLElement).innerText = 'Email is required';
    } else {
      (document.getElementById('emailInvalid') as HTMLElement).innerText = 'Email must be a valid email address';
    }
  }

  // showDetails
  async showDetails() {
    // business details
    await this.getBusinessDetail();
    await this.getBusinessReviews();

    // set the corresponding params
    this.name = this.businessDetail.name;
    this.address = this.businessDetail.location.display_address.join(' ');
    for (let i = 0; i < this.businessDetail.categories.length; i++) {
      if(i != 0) {
        this.category += " | ";
      }
      this.category += this.businessDetail.categories[i].alias;
    }
    this.phone = this.businessDetail.display_phone;
    this.price = this.businessDetail.price;
    this.status = this.businessDetail.hours[0].is_open_now;
    this.link = this.businessDetail.url;
    this.photos = this.businessDetail.photos;

    this.twitter = "Check " + this.name + " on Yelp.%0A" + this.link;


    // set marker and google map center
    let coordinates = {
      lat: this.businessDetail.coordinates.latitude,
      lng: this.businessDetail.coordinates.longitude
    };

    this.mapOptions = {
      center: coordinates,
      zoom : 14
    };

    this.markers.pop();

    this.markers.push({
      position: coordinates,
    })
  }

  // form control
  email = new FormControl('');
  date = new FormControl('');
  hour = new FormControl('');
  minute = new FormControl('');

  // reserve
  reserved(e:any) {
    if(this.email.valid && this.date.valid && this.hour.valid && this.minute.valid) {
      let time = this.hour.value + ':' + this.minute.value;
      this.storage.set(this.businessId as string, {
        name: this.name,
        email: this.email.value,
        date: this.date.value,
        time: time,
      });
      this.isReserved = true;
      alert("Reservation created!");
      (document.getElementById('closeModal') as HTMLElement).click();
    } else {
      (document.getElementById('reserveForm') as HTMLElement).classList.add('was-validated');
    }
  }

  clearModal() {
    this.email.setValue('');
    this.date.setValue('');
    this.hour.setValue('');
    this.minute.setValue('');
    (document.getElementById('reserveForm') as HTMLElement).classList.remove('was-validated');
  }

  // cancel
  cancel() {
    localStorage.removeItem(this.businessId as string);
    this.isReserved = false;
    alert("Reservation cancelled!")
  }

  // if this business has been reserved or not
  doSearch() {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if(key == this.businessId) {
        this.isReserved = true;
        break;
      }
    }
  }

  // return to the previous page
  turnBack() {
    (document.getElementById('business_detail') as HTMLElement).style.display = 'none';
    this.sendStatus.emit(true);
  }


  // get business details
  async getBusinessDetail() {
    let detail;
    await axios.get('/businessDetail', {
      params: {
        businessId: this.businessId
          // -5TFq3V--bffJGW000YuGQ
      }
    })
      .then(function (response:any){
        detail = response.data;
      })

    this.businessDetail = detail;
  }

  // get business reviews
  async getBusinessReviews() {
    let review;
    await axios.get('/businessReviews', {
      params: {
        businessId: this.businessId
      }
    })
      .then(function (response:any){
        review = response.data;
      })

    this.businessReviews = review;
  }


}
