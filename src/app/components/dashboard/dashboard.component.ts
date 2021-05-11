import { Component, OnInit } from '@angular/core';
import { Profile } from '@models/profile';
import { ProfileService } from '@services/profile/profile.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentProfile?: Profile;

  constructor(
    private userService: UserService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.userService.currentUser$
      .pipe(
        switchMap((user) =>
          user?.profile !== undefined
            ? this.profileService.getProfile(user.profile)
            : of(undefined)
        )
      )
      .subscribe((profile) => (this.currentProfile = profile));
  }
}
