import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from './material';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ProfileSecurityComponent } from './profile/profile-security/profile-security.component';
import { AvatarComponent } from './profile/profile-info/avatar/avatar.component';
import { UserService } from './services/user.service';
import { FileService } from './services/file.service';
import { ProfileResolver } from './resolvers/profile.resolver';

@NgModule({
   declarations: [
      AppComponent,
      LandingComponent,
      NavbarComponent,
      LoginComponent,
      RegisterComponent,
      ProfileComponent,
      ProfileInfoComponent,
      ProfileSecurityComponent,
      AvatarComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireStorageModule,
      BrowserAnimationsModule,
      MaterialModule,
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      ImageCropperModule,
      AngularFireAuthModule
   ],
   providers: [
      AuthService,
      UserService,
      FileService,
      ProfileResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
