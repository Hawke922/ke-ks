import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ProfileSecurityComponent } from './profile/profile-security/profile-security.component';
import { ProfileResolver } from './resolvers/profile.resolver';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'profil', component: ProfileComponent,
    children: [{
        path: 'info',
        component: ProfileInfoComponent,
        resolve: {user: ProfileResolver}
      }, {
        path: 'bezpecnost',
        component: ProfileSecurityComponent,
        resolve: {user: ProfileResolver}
      }
    ] },
  { path: '', component: LandingComponent},
  { path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
