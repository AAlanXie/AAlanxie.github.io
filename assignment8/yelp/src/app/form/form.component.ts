import {Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ServService} from "../serv.service";
import { MatInput } from '@angular/material/input';
import axios from "axios";
import * as events from "events";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {

  options:any;

  // form control
  keyword = new FormControl('', [Validators.required]);
  distance = new FormControl('', [Validators.required]);
  category = new FormControl('default');
  location = new FormControl('');
  autoCheck = new FormControl(false);


  // lat and lng
  coordinate:any;
  lat: String = "34.0223519";
  lng: String = "-118.285117";

  // business
  params: any;

  @Output() businessShow = new EventEmitter();

  @Output() resetPage = new EventEmitter();

  constructor(
    private service: ServService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    await this.keyword.valueChanges.subscribe(
      res => {
        this.getAutoComplete(res as string);
      }
    )
    await this.getIpLocation();
  }

  // get business details
  async getAutoComplete(text: string) {
    let detail;
    let terms;
    let categories;

    if(text) {
      await axios.get('/autoComplete', {
        params: {
          text: text
        }
      })
        .then(function (response:any){
          detail = response.data;
        })

      this.options = [];

      if(detail) {
        // @ts-ignore
        terms = detail.terms;

        // @ts-ignore
        categories = detail.categories;

        for (let i = 0; i < terms.length; i++) {
          this.options.push(terms[i].text);
        }
        for (let i = 0; i < categories.length; i++) {
          this.options.push(categories[i].title);
        }
      }

      //
      // this.options = detail;

    } else {
      this.options = [];
    }
  }

  // curlocation
  setCurLocation(e: Event) {
    // cancel the location box
    if(this.autoCheck.value == false){
      this.location.setValue('');
      this.location.disable();
    }
    // reset the location box
    else {
      this.location.setValue('');
      this.location.enable();
    }
  }

  // click the submit button
  async submitForm(e:any) {
    // check the valid
    if(this.keyword.valid && this.category.valid && (this.location.valid || this.autoCheck.value)) {
      // if auto check -> use current location
      if(this.autoCheck.value == true){
        this.lat = this.coordinate.split(',')[0];
        this.lng = this.coordinate.split(',')[1];
      } else {
        if(this.location.value != null){
          await this.getGoogleLocation(this.location.value);
        }
      }

      const dis = Number(this.distance.value == '' ? '10' : this.distance.value);

      // set the params
      this.params = {
        term: this.keyword.value,
        latitude: this.lat,
        longitude: this.lng,
        categories: this.category.value,
        radius: String(dis * 1600)
      }

      // send to business component
      this.businessShow.emit(this.params);
    }
  }

  // clear form
  clearForm() {
    // form control
    this.keyword.setValue('');
    this.distance.setValue('');
    this.category.setValue('default');
    this.location.enable();
    this.location.setValue('');
    this.autoCheck.setValue(false);

    this.resetPage.emit(true);
  }

  // if the checkbox is checked
  async getIpLocation() {
    // parse an observable object to json
    // await this.service.ipinfoLocation().subscribe(
    //   data => {
    //     const loc = JSON.parse(JSON.stringify(data)).loc;
    //     // define the lat and lng
    //     this.lat = loc.split(',')[0];
    //     this.lng = loc.split(',')[1];
    //   }
    // );

      await this.service.ipinfoLocation().subscribe(
      data => {
        this.coordinate = JSON.parse(JSON.stringify(data)).loc
      }
    )
  }

  // if the checkbox has not been checked
  async getGoogleLocation(address: string) {
    await Promise.resolve(this.service.googleLocation(address))
     .then((value) => {
      // define the lat and lng
      this.lat = String(value[0]);
      this.lng = String(value[1]);
    })

  }


}
