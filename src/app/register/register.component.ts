import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, AbstractControlOptions, FormControl, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserToRegister } from '../models/user-to-register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  userToRegister: UserToRegister;

  confirmErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;
      const formInvalid = control.touched && this.registerForm.get('password').touched && this.registerForm.invalid;
      return controlInvalid || formInvalid;
    }
  };

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private angularFireAuth: AngularFireAuth, 
              private angularFirestore: AngularFirestore) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      repeatPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('repeatPassword').value ? null : { 'mismatch': true };
  }

  register() {
    if (this.registerForm.valid) {
      this.userToRegister = Object.assign({}, this.registerForm.value);
      this.authService.emailSignup(this.userToRegister);
    }
  }
  
  
  // getErrorMessage() {
  //   if (this.registerForm.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }
}
