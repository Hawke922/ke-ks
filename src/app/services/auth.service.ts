import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
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

  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private router: Router) {
    this.user$ = this.angularFireAuth.authState.pipe(
      // before .pipe it listens to authState observable, then switchMap maps it into observable from DB
      switchMap(user => {
        // if user is found, make a call to DB to get user with same document name as uid
        // then create observable out of it with .valueChanges()
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        }
        // if user is not found, returns null for now, might switch to different value later
        // helps to tell when user is not logged in
        else {
          return of(null);
        }
      })
    );
  }

  register(email: string, password: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        // on success switch to landing and pass user info into login
        this.router.navigate(['/landing']);
        this.emailSignin(email, password);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  emailSignin(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        // on success do stuff
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    return this.router.navigate(['/landing']);
  }

  private updateUserData(user) {
    // taking info from AngularFire auth state and mirroring it into firestore document

    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uId}`);

    const data = {
      uId: user.uId,
      email: user.email,
      photoUrl: user.photoUrl,
      displayName: user.displayName
    };

    // calling .set is destructive - if there is an existing document in its place, it will erase data and replace it

    // since it is not desired behavior for returning user, adding {merge: true},
    // will only replace the properties that change in the data payload
    return userRef.set(data, {merge: true});
  }
}
