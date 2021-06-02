import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Profile } from '@models/profile';
import { User } from '@models/user';
import { ProfileService } from '@services/profile/profile.service';
import { UserService } from '@services/user/user.service';
import Fuse from 'fuse.js';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('container') private containerElement?: ElementRef<HTMLDivElement>;
  @ViewChild('header') private headerElement?: ElementRef<HTMLDivElement>;
  @ViewChild('userList') private userListElement?: ElementRef<HTMLUListElement>;

  searchResults$!: Observable<User[]>;
  private searchTerms$ = new BehaviorSubject<string>('');
  private profiles$ = new ReplaySubject<Profile[]>(1);
  private readonly fuseOptions: Fuse.IFuseOptions<User> = {
    threshold: 0.3,
    keys: ['username'],
  };

  constructor(
    private userService: UserService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const search$ = this.userService.getUsers().pipe(
      map((users) => {
        return { fuse: new Fuse(users, this.fuseOptions), users };
      })
    );

    this.searchResults$ = combineLatest([search$, this.searchTerms$]).pipe(
      map(([search, searchTerm]) => {
        if (searchTerm === '') return search.users;
        else return search.fuse.search(searchTerm).map((result) => result.item);
      })
    );

    this.profileService.getProfiles().subscribe(this.profiles$);
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  search(searchTerm: string): void {
    this.searchTerms$.next(searchTerm);
  }

  getProfileByUrl(url: string): Observable<Profile | undefined> {
    return this.profiles$.pipe(
      map((profiles) => {
        const id = this.profileService.getProfileIdByUrl(url);
        return profiles.find((profile) => profile.id === id);
      })
    );
  }

  @HostListener('window:resize')
  onResize(): void {
    if (
      this.containerElement == undefined ||
      this.headerElement == undefined ||
      this.userListElement == undefined
    )
      return;
    const containerRect =
      this.containerElement.nativeElement.getBoundingClientRect();
    const headerRect = this.headerElement.nativeElement.getBoundingClientRect();

    // 25px margin
    this.userListElement.nativeElement.style.height = `${
      containerRect.height - headerRect.height - 25
    }px`;
  }
}
