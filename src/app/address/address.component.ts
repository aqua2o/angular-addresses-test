import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AddressService } from './address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [AddressService]
})
export class AddressComponent implements OnInit {
  public addresses;
  public newAddressName;
  public newAddressZipCode;
  public newAddressCountry;
  public editingAddress = false;
  public editingAddressId;
  public path;
  registerForm: FormGroup;

  constructor(private AddressService: AddressService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  getAddresses(query = '') {
    return this.AddressService.get(query).then(addresses => {
      this.addresses = addresses;
    });
  }

  editAddress(address, index) {
    this.registerForm.setValue({
      fullName: address.name,
      zipcode: address.address.zip,
      country: address.address.country
    });
    this.editingAddress = true;
    this.editingAddressId = index;
  }

  addEditAddress() {

    if (this.registerForm.invalid) { // probably not needed
      return;
    }
    else {
      if(this.editingAddress) { // editing an existing address
        this.AddressService.edit(this.editingAddressId, this.registerForm.value.fullName, this.registerForm.value.zipcode, this.registerForm.value.country).then(()=> {
          this.registerForm.setValue({
            fullName: "",
            zipcode: "",
            country: ""
          });
          this.editingAddressId = undefined;
          this.registerForm.controls['fullName'].reset();
          this.registerForm.controls['zipcode'].reset();
          this.registerForm.controls['country'].reset();
          this.editingAddress = false;
        });
      }
      else { // adding a new address
        this.AddressService.add({ name: this.registerForm.value.fullName, address: { zip: this.registerForm.value.zipcode, country: this.registerForm.value.country } }).then(() => {
          return this.getAddresses();
        }).then(() => {
          this.registerForm.setValue({
            fullName: "",
            zipcode: "",
            country: ""
          });
          this.registerForm.controls['fullName'].reset();
          this.registerForm.controls['zipcode'].reset();
          this.registerForm.controls['country'].reset();
          this.editingAddress = false;
        });
      }
    }
  }

  destroyAddress(address) {
    this.AddressService.delete(address).then(() => {
      return this.getAddresses();
    });
  }

  // getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.path = params['status'];
      this.getAddresses(this.path);
    });
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^ABC[A-Za-z0-9]*')]],
      country: ['', [Validators.required]]
  });
  }
}
