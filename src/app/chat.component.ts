import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import {Router} from '@angular/router';


@Component({
    selector: 'chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

    items: FirebaseListObservable<any>;
    newMessage: string = '';
    user = {};
    userName: string = '';
    userImg: string = '';
    myId: string = '';
    userId: string = '';
    userEmail: string = '';
    myDate = Date.now();

    constructor(public router: Router, public af: AngularFire) {
        this.af.auth.subscribe(user => {
          if(user) {
            this.user = user;
            this.userName = user.auth.displayName;
            this.userImg = user.auth.photoURL;
            this.userId = user.auth.uid;
            this.userEmail = user.auth.email;
            this.myId = user.uid;
            // console.log(user);
          }
          else {
            this.user = {uid: ''};
          }
        });
        this.items = af.database.list('/items', {
            query: {
                limitToLast: 100,
                orderByKey: true
            }
        });
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage() {

        if (this.newMessage != '') {
            this.itemPush();
            this.newMessage = '';
            this.scrollToBottom();

        } else {
            alert('Введите сообщение');
        }
    }

    deleteItem(key: string) {
        this.items.remove(key);
    }

    logout() {
      this.af.auth.logout();
      this.router.navigate(['/login']);
    }

    submitMessage(event) {
        if (event.which === 13 && this.newMessage != '') {
            event.preventDefault();
            this.itemPush();
            this.newMessage = '';
            this.scrollToBottom();
        }
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    itemPush() {
        this.items.push({
            text: this.newMessage,
            user: this.userName,
            img: this.userImg,
            uid: this.userId,
            data: this.myDate
        });
    }

}
