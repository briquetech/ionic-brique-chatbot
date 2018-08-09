import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MessageBubble } from './message-bubble.ts';
 
const HTML_TEMPLATE = `
<div class="bubble-text">Welcome to the chat module!</div>
`;
 
const CSS_STYLE = `
.bubble-text {
	font-size: 12pt;
	color: #FF0000;
}
`;
 
@Component({
	selector: 'message-bubble',
	template: HTML_TEMPLATE,
	styles: [CSS_STYLE]
})
export class MessageBubbleComponent {
	constructor(private navCtrl: NavController) {}
 
	leavePage() {
			this.navCtrl.pop();
	}
}