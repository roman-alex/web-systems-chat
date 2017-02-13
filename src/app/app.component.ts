import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable} from 'angularfire2';
import { Router } from '@angular/router';
// import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
    chatSubscribe: FirebaseListObservable<any>;
    countMessage: number = 0;

    @ViewChild("audio") audio: any;

    constructor(public router: Router, public af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.chatSubscribe = this.af.database.list(`/people/${user.auth.uid}/privatChats`, { preserveSnapshot: true });
            this.chatSubscribe.subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                    let count = 0;
                    if (snapshot.val().info.read == false ) {
                        ++count;
                    }
                    if (!snapshot.val().info.read && (Date.now() + snapshot.val().date < 2000) ) {
                        this.audio.nativeElement.play();
                    }
                    this.countMessage = count;
                });
            });

          }
          else {
            this.router.navigate(['/login']);
          }
        });
    }

    logout() {
      this.af.auth.logout();
      this.router.navigate(['/login']);
    }
}
