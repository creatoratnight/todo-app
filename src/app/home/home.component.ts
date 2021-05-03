import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from "events";
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Output() isLogout: EventEmitter = new EventEmitter()
  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
  }

  logout() {
    this.firebaseService.logout();
    this.isLogout.emit(null);
  }

}
