import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage = {
    emailInUse: false,
    emailInUseMessage: 'Tento email je už u nás zaregistrovaný'
  };

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
    }, { validator: this.matchPassword });
  }

  matchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    if (AC.get('repeatPassword').touched || AC.get('repeatPassword').dirty) {
        const verifyPassword = AC.get('repeatPassword').value;

        if (password !== verifyPassword) {
            AC.get('repeatPassword').setErrors({ mismatch: true });
        } else {
            return null;
        }
    }
  }

  register() {
    if (this.registerForm.valid) {
      const userToRegister = Object.assign({}, this.registerForm.value);
      this.authService.emailSignup(userToRegister).catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.registerForm.get('email').setErrors({ emailInUse: true });
        }
      });
    }
  }

}
