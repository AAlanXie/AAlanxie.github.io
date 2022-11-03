import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { StorageService } from "../services/storage.service";


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  public reservationInfo: any[] = [];

  constructor(private router: Router, private storage: StorageService ) {}

  ngOnInit(): void {
    this.setReservation();
  }

  // each time we remove an item -> we reset the reservation
  setReservation() {
    this.reservationInfo = [];
    // write a loop
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = JSON.parse(localStorage.getItem(key as string) as string);
      this.reservationInfo.push({
        id: key,
        name: value.name,
        email: value.email,
        date: value.date,
        time: value.time
      })
    }
    // determine if we should show the table
    if(this.reservationInfo.length == 0) {
      (document.getElementById('bookings') as HTMLElement).style.display = 'none';
      (document.getElementById('nonList') as HTMLElement).style.display = 'block';
    } else {
      (document.getElementById('bookings') as HTMLElement).style.display = 'block';
      (document.getElementById('nonList') as HTMLElement).style.display = 'none';
    }
  }

  // remove item <- click the button
  removeItem(id:string) {
    localStorage.removeItem(id);
    this.setReservation();
    alert("Reservation cancelled!");
  }


}
