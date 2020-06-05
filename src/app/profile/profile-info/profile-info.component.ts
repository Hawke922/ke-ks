import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarComponent } from './avatar/avatar.component';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  newName: string;
  user: User;
  years: number[] = Array.from(Array(100), (e, i) => i + 1920).reverse();
  days: number[] = [...Array( 31 + 1).keys()].slice(1);
  months: string[] = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];

  constructor(public authService: AuthService, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.newName = data.user.displayName;
    });
  }

  openDialog() {
    this.dialog.open(AvatarComponent, {
      data: {
        displayName: this.user.displayName,
        email: this.user.email,
        photoURL: this.user.photoURL
      }
    });
  }

}
