import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  defaultAvatarSource = new BehaviorSubject<string>('../../assets/user.png');
  newAvatar = this.defaultAvatarSource.asObservable();

  constructor() { }

  newAvatarSelect(base64Image: string) {
    this.defaultAvatarSource.next(base64Image);
  }
}
