import { Injectable } from '@angular/core';
import { ImageMetadata } from '../models/image-metadata.model';
import { Observable, defer } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  // uploadImage(imageMetadata: ImageMetadata): Observable<ImageMetadata> {
  //   if (imageMetadata.imageBlob) {
  //     const fileToUpload = new File(
  //       [imageMetadata.imageBlob],
  //       imageMetadata.name
  //       , {type: imageMetadata.type});
  //     return this.upload(fileToUpload);
  //   }
  // }

  uploadImageProto(imageMetadata: ImageMetadata): Observable<ImageMetadata> {
      const fileToUpload = new File([imageMetadata.imageBlob], imageMetadata.name, {type: imageMetadata.type});
      this.storage.ref('users' + imageMetadata.id + imageMetadata.name).put(fileToUpload).then();
      return new Observable();
  }


  // upload(file: File): Observable<FileMetadata> {
  //   return this.addFileMetadata(
  //     {
  //       name: file.name,
  //       type: file.type,
  //       size: file.size,
  //       lastModified: file.lastModified
  //     }
  //   ).pipe(
  //     switchMap(fileMeta => {
  //       return defer(() =>
  //         this.storage.ref('product-pictures/' + fileMeta.id)
  //         .put(file)
  //         .then()
  //       ).pipe(
  //         map(fileRef => {
  //           return fileMeta;
  //         })
  //       );
  //     })
  //   );
  // }

  getAvatar(uid: string): Observable<ImageMetadata> {
    return this.storage.ref('users/' + uid + '/profile.jpg')
      .getDownloadURL();
  }
}
