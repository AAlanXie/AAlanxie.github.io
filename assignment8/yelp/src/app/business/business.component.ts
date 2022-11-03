import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  businesses:any = [];

  @Output() sendBusinessId = new EventEmitter();


  constructor() { }
  @Input()
  params?:object

  @Input()
  isBusinessShow?:any

  async ngOnChanges() {
    // check if we should show the business part
    if(this.isBusinessShow.status) {
      if(!this.isBusinessShow.isBack){
        await this.getBusiness();
      }
      // check if we could get the result of the business
      if(this.businesses.length != 0) {
        (document.getElementById('business') as HTMLElement).style.display = 'block';
        (document.getElementById('noResult') as HTMLElement).style.display = 'none';
      } else {
        (document.getElementById('business') as HTMLElement).style.display = 'none';
        (document.getElementById('noResult') as HTMLElement).style.display = 'block';
      }
    } else {
      (document.getElementById('business') as HTMLElement).style.display = 'none';
      (document.getElementById('noResult') as HTMLElement).style.display = 'none';
    }
  }

  async ngOnInit() {
    // await this.getBusiness();
    (document.getElementById('business') as HTMLElement).style.display = 'none';
    (document.getElementById('noResult') as HTMLElement).style.display = 'none';
  }

  // http://localhost:3000/business?term=dinner&radius=1600&categories=default&latitude=34.0223519&longitude=-118.285117
  async getBusiness() {
    let businessData: object[] = [];
    if(this.params) {
      await axios.get('/business', {
        params: this.params
      })
        .then(function (response:any){
          // console.log(response.data);
          businessData = response.data;
        })
    }

    this.businesses = businessData;
  }

  showDetail(businessId:string) {
    this.sendBusinessId.emit(businessId);
    (document.getElementById('business') as HTMLElement).style.display = 'none';
  }
}
