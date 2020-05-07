import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RegisterModel } from '../models/register.model';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: RegisterModel = new RegisterModel();

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      displayName: [this.user.displayName, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, Validators.required],
      password: [this.user.password, [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      repeatPassword: [this.user.repeatPassword, Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('repeatPassword').value ? null : { 'mismatch': true };
  }

  register() {
    if (this.registerForm.valid) {
      auth().createUserWithEmailAndPassword(this.user.email, this.user.password);
    }
  }

  // getErrorMessage() {
  //   if (this.registerForm.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }
}
