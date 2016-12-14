var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
var ChatComponent = (function () {
    function ChatComponent(router, af) {
        this.router = router;
        this.af = af;
        this.newMessage = '';
        this.user = {};
        this.userName = '';
        this.userImg = '';
        this.myId = '';
        this.userId = '';
        this.userEmail = '';
        this.myDate = Date.now();
    }
    ChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.subscribe(function (user) {
            if (user) {
                _this.user = user;
                _this.userName = user.auth.displayName;
                _this.userImg = user.auth.photoURL;
                _this.userId = user.auth.uid;
                _this.userEmail = user.auth.email;
                _this.myId = user.uid;
            }
            else {
                _this.user = { uid: '' };
            }
        });
        this.items = this.af.database.list('/items', {
            query: {
                limitToLast: 100,
                orderByKey: true
            }
        });
        this.scrollToBottom();
    };
    ChatComponent.prototype.ngAfterViewChecked = function () {
        this.scrollToBottom();
    };
    ChatComponent.prototype.sendMessage = function () {
        if (this.emojiInput.input != '') {
            this.itemPush();
            this.emojiInput.input = '';
            this.scrollToBottom();
        }
        else {
            alert('Введите сообщение');
        }
    };
    ChatComponent.prototype.deleteItem = function (key) {
        this.items.remove(key);
    };
    ChatComponent.prototype.logout = function () {
        this.af.auth.logout();
        this.router.navigate(['/login']);
    };
    ChatComponent.prototype.submitMessage = function (event) {
        if (event.which === 13 && this.emojiInput.input != '') {
            event.preventDefault();
            this.itemPush();
            this.emojiInput.input = '';
            this.scrollToBottom();
        }
    };
    ChatComponent.prototype.scrollToBottom = function () {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    };
    ChatComponent.prototype.itemPush = function () {
        this.inspectionInput('http://');
        this.inspectionInput('https://');
        this.items.push({
            text: this.emojiInput.input,
            user: this.userName,
            img: this.userImg,
            uid: this.userId,
            data: this.myDate
        });
    };
    ChatComponent.prototype.inspectionInput = function (val) {
        var message = this.emojiInput.input;
        if (message.indexOf('<iframe') != -1) {
            this.emojiInput.input = '';
        }
        else if (message.indexOf(val) != -1 && message.indexOf('<img') == -1) {
            var arr = message.split(' ');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf(val) != -1) {
                    arr[i] = "<a href=\"" + arr[i] + "\" target=\"_blank\">" + arr[i] + "</a>";
                }
            }
            this.emojiInput.input = arr.join(' ');
        }
    };
    return ChatComponent;
}());
__decorate([
    ViewChild('scrollMe'),
    __metadata("design:type", ElementRef)
], ChatComponent.prototype, "myScrollContainer", void 0);
__decorate([
    ViewChild('emojiInput'),
    __metadata("design:type", Object)
], ChatComponent.prototype, "emojiInput", void 0);
ChatComponent = __decorate([
    Component({
        selector: 'chat',
        templateUrl: 'chat.component.html',
        styleUrls: ['chat.component.css']
    }),
    __metadata("design:paramtypes", [Router, AngularFire])
], ChatComponent);
export { ChatComponent };
//# sourceMappingURL=../../../../src/app/chat.component.js.map