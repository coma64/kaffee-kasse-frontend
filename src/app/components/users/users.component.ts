import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerElement?: ElementRef;
  @ViewChild('header') headerElement?: ElementRef;
  @ViewChild('userList') userListElement?: ElementRef;

  users?: Observable<User[]>;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  onResize(): void {
    const containerRect = (
      this.containerElement?.nativeElement as HTMLDivElement
    ).getBoundingClientRect();
    const headerRect = (
      this.headerElement?.nativeElement as HTMLDivElement
    ).getBoundingClientRect();

    // 2rem for margins
    (
      this.userListElement?.nativeElement as HTMLDivElement
    ).style.height = `calc(${
      containerRect.height - headerRect.height
    }px - 2rem)`;
  }
}
