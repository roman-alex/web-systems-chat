import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
    selector: 'chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

    items: FirebaseListObservable<any>;
    newMessage: string = '';
    user = <any>{};
    myDate = Date.now();
    storageRef: any;

    constructor(@Inject(FirebaseApp) firebaseApp: any, public router: Router, public af: AngularFire) {
        this.storageRef = firebaseApp.storage().ref();
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('emojiInput') private emojiInput;

    ngOnInit() {
        this.af.auth.subscribe(user => {
            if(user) {
                this.user.name = user.auth.displayName;
                this.user.img = user.auth.photoURL;
                this.user.id = user.auth.uid;
                this.user.email = user.auth.email;
            }
            else {
                this.user = {uid: ''};
            }
        });
        this.items = this.af.database.list('/items');
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
            user: this.user.name,
            img: this.user.img,
            uid: this.user.id,
            data: this.myDate
        });
    }

    inspectionInput(val) {
        let message: string = this.emojiInput.input;

        if ( message.indexOf('<iframe') != -1) {
                this.emojiInput.input = 'Я Олень, який хотів добавити <b>iframe</b> і положити сайт. Але Рома вже пофіксив цей баг';
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

    loadImg(e) {

        var files = e.target.files[0];
        var fileImg = '';
        var metadata = {
          contentType: 'image/jpeg/png'
        };

        var uploadTask = this.storageRef.child(`images/chat/${this.user.id}/${Date.now()}-${files.name}`).put(files, metadata);

        uploadTask.on('state_changed', (snapshot) => {
                // this.uploader.nativeElement.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, (error) => {
                console.log('error: ' + error);
            }, () => {
                var downloadURL = uploadTask.snapshot.downloadURL;
                this.items.push({
                    fileImgDownload: downloadURL,
                    user: this.user.name,
                    img: this.user.img,
                    uid: this.user.id,
                    data: this.myDate
                });
        });
    }

    loadFiles(e) {

        var files = e.target.files[0];
        var fileImg = '';
        var metadata = {
          contentType: null
        };

        var obj = files.name.split('.');
        var ext = obj[obj.length -1];

        if(ext=="pdf" || ext=="docx" || ext=="doc" ||  ext=="zip"){
            if(files.size > 20000000) {
                alert('Файл перевищує 20МБ');
            } else {
                var uploadTask = this.storageRef.child(`docs/chat/${this.user.id}/${Date.now()}-${files.name}`).put(files, metadata);

                uploadTask.on('state_changed', (snapshot) => {
                        // this.uploader.nativeElement.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, (error) => {
                        console.log('error: ' + error);
                    }, () => {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        this.items.push({
                            fileDocName: files.name,
                            fileDocDownload: downloadURL,
                            user: this.user.name,
                            img: this.user.img,
                            uid: this.user.id,
                            data: this.myDate
                        });
                });
            }
        } else{
            alert('Невідомий формат документа');
        };
    }
}
