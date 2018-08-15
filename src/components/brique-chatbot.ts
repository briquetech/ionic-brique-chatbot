import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BRIQUEChatProvider } from '../providers/chat-provider';
import { MdlChatBlock } from './chat-message';
// import { CMPChatAction } from './chat-action';, MdlChatMessage

const HTML_TEMPLATE = `
<ion-header>
	<ion-navbar>
		<ion-title>
			{{ chatbotName }}
		</ion-title>
	</ion-navbar>
</ion-header>
<ion-content padding class="chatbot-direct-chat-messages">
	<ng-template ngFor let-chatMessage [ngForOf]="chatMessages">
		<div class="clearfix">
			<div col-10 class="bubble-container">
				<div class="white-bubble">
					<div class="bubble-content">
						<span>{{ chatMessage.title }}&nbsp;</span>
					</div>
				</div>
			</div>
		</div>
	</ng-template>
	<div class="clearfix" *ngIf="showWave == true">
		<div col-10 class="bubble-container">
			<div class="white-bubble">
				<div class="bubble-content">
					<div id="wave"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
				</div>
			</div>
		</div>
	</div>
</ion-content>
<ion-footer>
	<div class="chatbot-action-container">
		<ul class='__exit-buttonsInline' *ngIf="chatbotActions.length > 0">
			<li *ngFor="let chatbotAction of chatbotActions"><a href="#" class="__chatbot-action-button" (click)="optionClick(chatbotAction);">{{ chatbotAction.title }}</a></li>
		</ul>
	</div>
</ion-footer>
`;

const CHATBOT_CSS = `
.clearfix::after {
content: "";
clear: both;
}
.chatbot-direct-chat-messages {
overflow: auto;
padding: 10px;
background-color: #f3f3f3;
height: 100%;
}
.bubble-container{
display: inline-block;
padding: 0;
}
.white-bubble {
background-color: #fff;
font-size: 15px;
border-top-left-radius: 0em;
border-top-right-radius: 0.5em;
border-bottom-left-radius: 0.5em;
border-bottom-right-radius: 0.5em;
box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.35);
width: auto;
display: inline-block;
overflow: hidden;
float: left;
padding-left: 0px;
margin: 0px 0px 2px 0px;
}
.blue-bubble {
color: #fff;
background-color: #0084ff;
padding: 12px;
font-size: 15px;
border-top-left-radius: 0.9em;
border-top-right-radius: 0.2em;
border-bottom-left-radius: 0.9em;
border-bottom-right-radius: 0.9em;
width: auto;
display: inline-block;
float: right;
}
.bubble-content {
padding: 10px;
display: flex;
flex-grow: 1;
}
.btn-inapp {
margin: 0 !important;
color: #656565;
}
.form-bubble {
background-color: #fff;
font-size: 15px;
border-top-left-radius: 0.2em;
border-top-right-radius: 0.9em;
border-bottom-left-radius: 0.9em;
border-bottom-right-radius: 0.9em;
box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.35);
width: auto;
display: flex;
overflow: hidden;
}
.form-content {
padding: 10px;
display: flex;
flex-grow: 1;
}
.form-content ion-label {
color: #000 !important;
font-size: 16px !important;
}
.nonfix {
text-align: center;
margin: 0 auto;
}
.chatbot-action-container{
text-align: center;
padding: 0 10px;
position:relative;
}
.__exit-buttonsBlock {
list-style-type: none;
padding-left: 0px;
margin: 10px 0;
}
.__exit-buttonsBlock li {
display: block;
margin: 16px 0;
}
.__exit-buttonsBlock li a {
text-decoration: none;
background-color: #ff4d72;
color: #fff;
padding: 8px 15px;
font-size: 15px;
font-weight: bold;
width: auto;
display: block;
border-top-left-radius: 0.1em;
border-top-right-radius: 0.6em;
border-bottom-left-radius: 0.6em;
border-bottom-right-radius: 0.6em;
box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.25);
}
.__exit-buttonsInline {
list-style-type: none;
padding-left: 0px;
margin: 10px 0;
}
.__exit-buttonsInline li {
display: inline-flex;
margin: 0 3px 3px;
}
.__exit-buttonsInline li a {
background-color: #ff4d72;
color: #fff;
padding: 8px 15px;
font-size: 15px;
font-weight: bold;
display: block;
width: auto;
border-top-left-radius: 0.2em;
border-top-right-radius: 1.3em;
border-bottom-left-radius: 1.3em;
border-bottom-right-radius: 1.3em;
box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.25);
}
div#wave {
  position: relative;
  margin-top: 0vh;
  text-align: center;
  width: 50px;
  /* height: 50px; */
  margin-left: auto;
  margin-right: auto;
}
div#wave .dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 3px;
  background: #303131;
  animation: wave 1.3s linear infinite;
}
div#wave .dot:nth-child(2) {
  animation-delay: -1.1s;
}
div#wave .dot:nth-child(3) {
  animation-delay: -0.9s;
}
@keyframes wave {
	0%, 60%, 100% {
		transform: initial;
	}

	30% {
		transform: translateY(-10px);
	}
}
`;
@Component({
	// selector: 'brique-chatbot',
	template: HTML_TEMPLATE,
	styles: [CHATBOT_CSS],
	providers: [ BRIQUEChatProvider ]
})
export class BRIQUEChatbot {

	customerCode: string;
	botCode: string;
    apiEndpoint: string;

	initiateEndpoint: string;
    initiateResponse: string;

	postRouteResponseEndpoint: string;
	postRRResponse: string;

	postSubjectSelectionEndpoint: string;
	postSSResponse: string;

	// These are the most important blocks
	chatbotName: string;

	currentBlock: MdlChatBlock;
	currentBlockMessages: any[] = [];
	chatMessages: any[] = [];
	chatbotActions: any[] =[];
	showWave: boolean = true;

	//
	exitMessage={};
	currentBlockMessageIndex=0;
	subjects=[];

	currentSelection=1;
	chatbotImage = "";

	constructor(private navCtrl: NavController,
        private navParams:NavParams,
        private chatProvider: BRIQUEChatProvider) {
			this.customerCode 	= this.navParams.get("customerCode");
			this.botCode 		= this.navParams.get("botCode");
	        this.apiEndpoint	= this.navParams.get("apiEndpoint");
	        if( this.customerCode == null || this.customerCode === undefined || this.customerCode.trim().length == 0 ||
	            this.botCode == null || this.botCode === undefined || this.botCode.trim().length == 0 ||
	            this.apiEndpoint == null || this.apiEndpoint === undefined || this.apiEndpoint.trim().length == 0 )
	            throw new Error("Improper Chatbot registration. Please provide the customer code, bot code and the endpoint URL.");
			this.registerChatbot();
	}

    // Call to register the chatbot
	private registerChatbot(){
		console.log("Call to register the chatbot");
		this.initiateChat();
	}

	// Reset the blocks
	private resetBlocks(){
		this.currentBlock = null;
		this.exitMessage={};
		this.currentBlockMessageIndex=0;
		this.chatbotActions = [];
	}

    // Call to initiate the chat
	private initiateChat(){
		// console.log("Call to initiate the chat");
		this.chatProvider.initiateChat(this.customerCode, this.botCode, this.apiEndpoint).then(data=>{
            // console.log("Got the data from the server.");
            console.log(data);
			this.resetBlocks();
			if( data.hasOwnProperty("chatbot") && data["chatbot"] != null && data["chatbot"] !== undefined ){
				let chatbot = data["chatbot"];
				this.chatbotName = chatbot["bot_name"];
			}
			if( data.hasOwnProperty("greeting") && data["greeting"] != null && data["greeting"] !== undefined ){
				let greeting = data["greeting"];
				if( greeting.hasOwnProperty("block") && greeting["block"] != null && greeting["block"] !== undefined ){
					this.currentBlock = new MdlChatBlock(greeting["block"]);
					this.currentBlockMessages = this.currentBlock.messages;
					this.currentBlockMessageIndex = 0;
					this.currentSelection = greeting["status"];
					// console.log(this.currentBlock);
					this.processBlock();
				}
				if( greeting.hasOwnProperty("subjects") && greeting["subjects"] != null && greeting["subjects"] !== undefined ){
					this.subjects = greeting["subjects"];
				}
			}
        });
	}

	// Processes the chat block, push all the chat messages
	private processBlock(){
		if( this.currentBlockMessages != null && this.currentBlockMessages.length > 0 ){
			if ( this.currentBlockMessageIndex >= this.currentBlockMessages.length){
				// Time to show the subjects and return
				console.log("currentSelection :: "+this.currentSelection);
				if( this.currentSelection == 1 ){
					if( this.chatbotActions != null && this.chatbotActions.length > 0 ){
						// showExitMessage();
						console.log("ShowExitMessage");
					}
				}
				else if( this.currentSelection == 2 ){
					this.showWave = true;
					this.showSubjects();
				}
				else{
					// This may mean that the conversation may have ended
					// this.showEndConversation();
				}
				return;
			}
			this.showWave = true;
			// Lets add the message
			console.log("Looking up message number "+this.currentBlockMessageIndex);
			let blockMessage = this.currentBlockMessages[this.currentBlockMessageIndex];
			blockMessage.sender = 1;
			blockMessage.message_id = Date.now();
			console.log(blockMessage);
			setTimeout(() => {
				this.chatMessages.push(blockMessage);
				this.showWave = false;
				this.currentBlockMessageIndex++;
				this.processBlock();
			}, blockMessage.showafter);
		}
		else{
			// Time to show exit message or subjects
		}


	}

	// Show the subjects
	private showSubjects(){
		// console.log("showSubjects");
		var message = { type: "-1", title: "What goals are you planning for?" };
		setTimeout(()=>{
			this.showWave = false;
			this.chatMessages.push(message);
			// Show the actions
			for(let subject of this.subjects){
				var route = { block_route_id: subject.subject_id, type: 101, title: subject.subject_title,  };
				this.chatbotActions.push(route);
			}
		}, 500);
	}

	private optionClick(chatbotAction: any){
		console.log("Route clicked");
		if( chatbotAction.type == 101 ){
			// Subject was selected
			this.processSubjectResponse(chatbotAction);
		}
		else if( chatbotAction.type == 102 ){
			// route was selected
		}
	}

	private processSubjectResponse(chatbotAction: any){
		this.resetBlocks();
		this.chatProvider.postSubjectSelection(this.customerCode, this.botCode, this.apiEndpoint, chatbotAction.message_id).then(data=>{
			console.log("Subject response data");
			console.log(data);
		});
	}

	// --------------------------
	private showMyResponse(){

	}
}
