import { Injectable } from '@angular/core';
import { ImageMetadata } from '../models/image-metadata.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { take, last, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage) { }

  updateAvatar(imageMetaData: ImageMetadata): Observable<any> {

    if (imageMetaData) {
      const avatarToUpload = new File([imageMetaData.imageBlob], imageMetaData.name, { type: imageMetaData.type });

      const fileRef = this.storage.ref('avatars/' + imageMetaData.uid + '/avatar.jpg');

      const task = fileRef.put(avatarToUpload);

      return task.snapshotChanges()
        .pipe(
          last(),
          concatMap(() => fileRef.getDownloadURL())
        );
    }
  }

  getAvatar(uid: string): Observable<any> {
    return this.storage.ref('users/' + uid + '/avatar.jpg')
      .getDownloadURL();
  }

}
