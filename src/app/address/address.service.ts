import { Injectable } from '@angular/core';


let ADDRESSES = [
  { name: 'John Smith', address: { zip: "ABC12", country: "UK" } },
  { name: 'Bruce Doe', address: { zip: "ABC34", country: "GR" } },
  { name: 'Mark Foo', address: { zip: "ABC56", country: "FR" } },
];

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() { }

  get(query = '') {
    return new Promise(resolve => {
      let data;
      data = ADDRESSES;
      resolve(data);
    });
  }

  add(data) {
    return new Promise(resolve => {
      ADDRESSES.push(data);
      resolve(data);
    });
  }

  edit(index, name, zipCode, country) {
    return new Promise(resolve => {
      ADDRESSES[index].name = name;
      ADDRESSES[index].address.zip = zipCode;
      ADDRESSES[index].address.country = country;
      resolve(true);
    });
  }

  delete(selected) {
    return new Promise(resolve => {
      const index = ADDRESSES.findIndex(address => address === selected);
      ADDRESSES.splice(index, 1);
      resolve(true);
    });
  }

}
