import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  isLoggedIn: boolean;

  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private router: Router) {
    this.user$ = this.angularFireAuth.authState.pipe(
      // before .pipe it listens to authState observable, then switchMap maps it into observable from DB
      switchMap(user => {
        // if user is found, make a call to DB to get user with same document name as uid
        // then create observable out of it with .valueChanges()
        if (user) {
          this.isLoggedIn = true;
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        }
        // if user is not found, returns null for now, might switch to different value later
        // helps to tell when user is not logged in
        else {
          this.isLoggedIn = false;
          return of(null);
        }
      })
    );
  }

  async emailSignup(userToRegister: User) {
    const keksAvatar = 'https://firebasestorage.googleapis.com/v0/b/keks-development.appspot.com/o/user.png?alt=media&token=771c84d5-7cc8-4e07-a26b-63c0262a91bd';

    const credential = await this.angularFireAuth.createUserWithEmailAndPassword(userToRegister.email, userToRegister.password)
      .then((result) => {
        result.user.updateProfile({
          displayName: userToRegister.displayName,
          photoURL: keksAvatar
        });

        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${result.user.uid}`);
        const data = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: userToRegister.displayName,
          photoURL: keksAvatar
        };

        this.router.navigate(['/landing']);

        return userRef.set(data, {merge: true});
      });
  }

  async emailSignin(user: User) {
    const credential = await this.angularFireAuth.signInWithEmailAndPassword(user.email, user.password);
    this.router.navigate(['/landing']);
    return this.updateUserData(credential.user);
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    this.router.navigate(['/landing']);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    return this.router.navigate(['/landing']);
  }

  private updateUserData(user) {
    // taking info from AngularFire auth state and mirroring it into firestore document

    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName
    };

    // calling .set is destructive - if there is an existing document in its place, it will erase data and replace it

    // since it is not desired behavior for returning user, adding {merge: true},
    // will only replace the properties that change in the data payload
    return userRef.set(data, {merge: true});
  }

}
