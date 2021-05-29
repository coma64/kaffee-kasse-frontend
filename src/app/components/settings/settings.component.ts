import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="container mt-2">
      <app-user-settings [user]="currentUser"></app-user-settings>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  currentUser?: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(
      (user) => (this.currentUser = user)
    );
  }
}
