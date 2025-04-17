import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private currentTime$ = new BehaviorSubject<string>(new Date().toLocaleTimeString());

  constructor() {
    interval(1000).pipe(
      map(() => new Date().toLocaleTimeString())
    ).subscribe(time => this.currentTime$.next(time));
  }

  getCurrentTime() {
    return this.currentTime$.asObservable();
  }

  getCurrentDate() {
    return new Date();
  }
}