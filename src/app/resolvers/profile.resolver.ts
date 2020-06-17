import { User } from '../models/user.model';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable()
export class ProfileResolver implements Resolve<User> {
    constructor(private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.authService.user$.pipe(take(1));
    }
}
