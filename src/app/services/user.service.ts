import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, defer } from 'rxjs';
import { ImageMetadata } from '../models/image-metadata.model';
import { auth } from 'firebase';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { FileService } from './file.service';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  defaultAvatarSource = new BehaviorSubject<ImageMetadata>(null);
  newAvatar = this.defaultAvatarSource.asObservable();

  constructor(private angularFirestore: AngularFirestore, private fileService: FileService, private afAuth: AngularFireAuth) { }

  newAvatarSelect(imageMeta: ImageMetadata) {
    this.defaultAvatarSource.next(imageMeta);
  }

  updateUser(userToUpdate: Partial<User>, avatarToUpdate?: ImageMetadata): Observable<void> {
    const user = auth().currentUser;
    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${userToUpdate.uid}`);
    const data = {
      photoURL: userToUpdate.photoURL,
      birthday: userToUpdate.birthday,
      gender: userToUpdate.gender,
      displayName: userToUpdate.displayName,
      bio: userToUpdate.bio
    };

    if (!avatarToUpdate) {
      return defer (() => {
        user.updateProfile({
          displayName: userToUpdate.displayName,
          photoURL: userToUpdate.photoURL
        }).then(() => {
          return userRef.update(data);
        });
      });
    } else {
      return this.fileService.updateAvatar(avatarToUpdate)
        .pipe(
          switchMap(url => {
            data.photoURL = url;
            return defer (() => {
              user.updateProfile({
                displayName: userToUpdate.displayName,
                photoURL: url
              }).then(() => {
                return userRef.update(data);
              });
            });
          })
        );
    }
  }

  dateConverter(timestamp: any, operation: string) {
    if (timestamp && timestamp !== '') {
      const date = timestamp.toDate();
      if (operation === 'day') {
        return date.getDate();
      } else if (operation === 'month') {
        return date.getMonth();
      } else if (operation === 'year') {
        return date.getFullYear();
      } else {
        return 'Chyba';
      }
    } else {
      return '';
    }
  }
}
