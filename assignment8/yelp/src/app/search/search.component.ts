import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  params: any;
  ifBusinessShow = {
    status: false,
    number: 1,
    isBack: false
  };


  businessId:string = ''
  status = {
    number: 1,
    reset: false
  };

  constructor() {
  }

  changeParams(formVal: any) {
    this.params = formVal;
    this.ifBusinessShow = {
      status: true,
      number: this.ifBusinessShow.number + 1,
      isBack: false
    };
  }

  rcvBusinessId(businessId: string) {
    this.businessId = businessId;
    this.status = {
      number: this.status.number + 1,
      reset: false
    };
  }

  rcvStatus(status: any) {
    this.ifBusinessShow = {
      status: true,
      number: this.ifBusinessShow.number + 1,
      isBack: true
    }
  }

  rcvReset(status: boolean) {
    this.ifBusinessShow = {
      status: false,
      number: 1,
      isBack: false
    }

    this.status = {
      number: 1,
      reset: true
    }
  }

  ngOnInit(): void {
  }

}
