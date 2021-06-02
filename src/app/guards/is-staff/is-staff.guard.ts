import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsStaffGuard implements CanActivate {
  constructor(private userService: UserService, private location: Location) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.currentUser?.is_staff) return true;

    this.location.back();
    return false;
  }
}
