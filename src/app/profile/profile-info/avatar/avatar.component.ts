import { Component, OnInit, Output, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private authService: AuthService, private storage: AngularFireStorage, private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public user: User) { }

  ngOnInit(): void {
    // this.authService.user$.subscribe(user => this.user = user);
    console.log(this.user);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  loadImageFailed() {
    // show message
  }

  saveCroppedAvatar() {
  }
}
