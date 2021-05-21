import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
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
