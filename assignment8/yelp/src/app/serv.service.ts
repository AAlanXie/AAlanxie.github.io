import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServService {

  // google map api
  ggKey = "AIzaSyAWn7aX2QRsPcuPzsrzC4IvTcpe61uqtRw";

  // ipinfo api
  ipinfoKey = "3fb7195d86fc03";


  constructor(private http: HttpClient) { }


  // get the ipinfo location
  ipinfoLocation(){
    return this.http.get(`https://ipinfo.io/json?token=${this.ipinfoKey}`);
  }


  // get google location
  async googleLocation(address: string): Promise<number[]> {

    // return the location
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.ggKey}`;

    try {
      // define the result of lat and lng
      const location = await fetch(geocodingUrl).then(result => result.json())
        .then(featureCollection => {
          // get the location
          const lat = featureCollection.results[0].geometry.location.lat;
          const lng = featureCollection.results[0].geometry.location.lng;
          return [lat, lng];
        });

      return location;
    } catch (e) {
      console.log(e);
    }
    return [0.0, 0.0];
  }
}
