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

    constructor(public router: Router, public af: AngularFire) {}

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('emojiInput') private emojiInput;

    ngOnInit() {
        this.af.auth.subscribe(user => {
          if(user) {
            this.user = user;
            this.userName = user.auth.displayName;
            this.userImg = user.auth.photoURL;
            this.userId = user.auth.uid;
            this.userEmail = user.auth.email;
            this.myId = user.uid;
          }
          else {
            this.user = {uid: ''};
          }
        });

        this.items = this.af.database.list('/items', {
            query: {
                limitToLast: 100,
                orderByKey: true
            }
        });

        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage() {

        if (this.emojiInput.input != '') {
            this.itemPush();
            this.emojiInput.input = '';
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
        if (event.which === 13 && this.emojiInput.input != '') {
            event.preventDefault();
            this.itemPush();
            this.emojiInput.input = '';
            this.scrollToBottom();
        }
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    itemPush() {
        this.inspectionInput('http://');
        this.inspectionInput('https://');
        this.items.push({
            text: this.emojiInput.input,
            user: this.userName,
            img: this.userImg,
            uid: this.userId,
            data: this.myDate
        });
    }

    inspectionInput(val) {
        let message: string = this.emojiInput.input;

        if ( message.indexOf('<iframe') != -1) {
            this.emojiInput.input = '';
        } else if ( message.indexOf(val) != -1 && message.indexOf('<img') == -1) {
            let arr = message.split(' ');
            for (let i = 0; i < arr.length; i++) {
                if ( arr[i].indexOf(val) != -1 ) {
                    arr[i] = `<a href="${arr[i]}" target="_blank">${arr[i]}</a>`
                }
            }
            this.emojiInput.input = arr.join(' ');
        }
    }

}
