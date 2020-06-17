import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarComponent } from './avatar/avatar.component';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { FileService } from 'src/app/services/file.service';
import { ImageMetadata } from 'src/app/models/image-metadata.model';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  updateUserForm: FormGroup;
  newName: string;
  user: User;
  years: number[] = Array.from(Array(100), (e, i) => i + 1920).reverse();
  days: number[] = [...Array( 31 + 1).keys()].slice(1);
  months: string[] = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
  avatarToUpdate: ImageMetadata;
  avatarPreview: string;

  constructor(public authService: AuthService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private fileService: FileService,
              private storage: AngularFireStorage,
              private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.newName = data.user.displayName;
    });

    this.createUpdateUserForm();

    this.userService.newAvatar.subscribe(avatar => {
      if (avatar) {
        this.avatarToUpdate = avatar;
        this.avatarPreview = avatar.base64Image;
      } else {
        return null;
      }
    });
  }

  createUpdateUserForm() {
    this.updateUserForm = this.formBuilder.group({
      displayName: this.user.displayName,
      gender: this.checker(this.user.gender),
      day: this.userService.dateConverter(this.user.birthday, 'day'),
      month: this.checker(this.userService.dateConverter(this.user.birthday, 'month')),
      year: this.userService.dateConverter(this.user.birthday, 'year'),
      bio: this.user.bio
    }, { validator: this.dateValidator });
  }

  checker(value) {
    if (value) {
      if (typeof value === 'string') {
        return value;
      } else if (typeof value === 'number') {
        return this.months[value];
      } else {
        return 'Chyba';
      }
    } else {
      return '';
    }
  }

  dateValidator(AC: AbstractControl) {
    const day = AC.get('day');
    const month = AC.get('month');
    const year = AC.get('year');

    if (((day.dirty && month.dirty && year.dirty) && (day.value !== undefined || month.value !== undefined || year.value !== undefined)) ||
        (day.pristine && month.pristine && year.pristine) ||
        ((day.dirty || month.dirty || year.dirty) && (day.value !== undefined && month.value !== undefined && year.value !== undefined))) {
      return null;
    } else {
      return ({ fillAll: true });
    }
  }

  openDialog() {
    this.dialog.open(AvatarComponent, {
      data: {
        displayName: this.user.displayName,
        email: this.user.email,
        photoURL: this.user.photoURL,
        uid: this.user.uid
      }
    });
  }

  updateUser() {
    const month = this.months.findIndex(element => element.includes(this.updateUserForm.value.month));
    const birthday = new Date(this.updateUserForm.value.year, month, this.updateUserForm.value.day);
    const userToUpdate: Partial<User> = {
      uid: this.user.uid,
      birthday: firebase.firestore.Timestamp.fromDate(birthday),
      photoURL: this.user.photoURL,
      gender: this.updateUserForm.value.gender,
      displayName: this.updateUserForm.value.displayName,
      bio: this.updateUserForm.value.bio
    };

    if (this.updateUserForm.valid && this.avatarToUpdate) {

      this.userService.updateUser(userToUpdate, this.avatarToUpdate).subscribe();

    } else if (this.updateUserForm.valid && !this.avatarToUpdate) {

      this.userService.updateUser(userToUpdate).subscribe();

    } else {
      console.log('wut');
    }
  }

  log() {
    this.afAuth.user.pipe(take(1)).subscribe(console.log);
  }
}
