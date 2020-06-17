import { Component, OnInit, Output, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { base64ToFile } from 'ngx-image-cropper';
import { ImageMetadata } from 'src/app/models/image-metadata.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedBlob: Blob;

  constructor(@Inject(MAT_DIALOG_DATA) public user: User, private userService: UserService) { }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedBlob = base64ToFile(event.base64);
  }
  loadImageFailed() {
    // show message
  }

  saveCroppedAvatar() {
    const fileBeforeCropped = this.imageChangedEvent.target.files[0];
    const imageMeta: ImageMetadata = {
      base64Image: this.croppedImage,
      imageBlob: this.croppedBlob,
      name: fileBeforeCropped.name,
      type: 'image/jpg',
      uid: this.user.uid
    };
    this.userService.newAvatarSelect(imageMeta);
  }
}
