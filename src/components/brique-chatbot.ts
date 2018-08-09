import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MessageBubbleComponent } from './message-bubble';
 
const HTML_TEMPLATE = `
<div class="special-text">Welcome to the chat module!</div>
<message-bubble></message-bubble>
<button ion-button full icon-left (click)="leavePage()"><ion-icon name="close"></ion-icon>Close the Page</button>
`;
 
const CSS_STYLE = `
.special-text {
	font-size: 15pt;
	text-align: center;
	color: #0000FF;
}
`;
 
@Component({
	selector: 'brique-chatbot',
	template: HTML_TEMPLATE,
	styles: [CSS_STYLE]
})
export class BRIQUEChatbotComponent {
	constructor(private navCtrl: NavController) {}
 
	leavePage() {
		this.navCtrl.pop();
	}
}