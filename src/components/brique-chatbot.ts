import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { BRIQUEChatProvider } from '../providers/chat-provider';
import { MdlChatBlock } from './chat-block';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CMPChatAction } from './chat-action';, MdlChatMessage

// TO Build
// npm uninstall ionic-umbrellium-chatbot && npm install /home/jay/IONIC/chatbot-plugin/ionic-umbrellium-chatbot
const HTML_TEMPLATE = `
	<div class="chatbot-container" #content>
		<div #list class="list chatbot-direct-chat-messages" [scrollTop]="list.scrollHeight">
			<ng-template ngFor let-chatMessage let-i="index" [ngForOf]="chatMessages">
				<div col-10 class="bubble-container" *ngIf="chatMessage.sender == 1">
					<span class="bot-icon"><img *ngIf="i==0" src="assets/imgs/bot-icon.jpg"></span>
					<div class="white-bubble" [ngClass]="[chatMessage.subtype == '10'?'__chatbot-notification':'',chatMessage.subtype == '11'?'__chatbot-successful':'', chatMessage.subtype == '12'?'__chatbot-warning insight-message-container':'',chatMessage.subtype == '13'?'__chatbot-fatal':'']">
						<div [ngClass]="(chatMessage.subtype == '1'?'image-wrapper':'') || (chatMessage.subtype == '12'?'insight-icon':'')" *ngIf="chatMessage.include_image !== undefined && chatMessage.include_image==1 && chatMessage.resource_type !== undefined && chatMessage.resource_type == 'i' && chatMessage.resource_url.length > 0">
						  <img src='{{ chatMessage.resource_url }}' class="__chatbot-image" alt="">
						</div>
						<div *ngIf="chatMessage.subtype == '12'">
							<div class="message-div">
								<div [ngClass]="(chatMessage.title!= null && chatMessage.title !== undefined && chatMessage.body!= null && chatMessage.body!==undefined ?'__chatbot-body-title':'')">{{ chatMessage.title }}</div>
								<div *ngIf="chatMessage.body != null && chatMessage.body !== undefined">
									{{ chatMessage.body }}
								</div>
								<a href="#" class="link-inapp" *ngIf="chatMessage.open_url!==null && (chatMessage.url_resource_type == 'w' || chatMessage.url_resource_type == 'p') && chatMessage.show_as == 'l'"  (click)="openNewUrl(chatMessage.url_resource_type, chatMessage.open_url)">Read</a>

								<button ion-button class="btn-inapp" *ngIf="chatMessage.open_url!==null && (chatMessage.url_resource_type == 'w' || chatMessage.url_resource_type == 'p') && chatMessage.show_as == 'b'" (click)="openNewUrl(chatMessage.url_resource_type, chatMessage.open_url)">Action</button>
							</div>
						</div>
						<div *ngIf="chatMessage.subtype !== '12'" [ngClass]="(chatMessage.include_image!= null && chatMessage.include_image !== undefined && chatMessage.include_image==1 && chatMessage.resource_type!==undefined && chatMessage.resource_type == 'i' ?'image-content ':'bubble-content')">
							<div [ngClass]="(chatMessage.title!= null && chatMessage.title !== undefined && chatMessage.body!= null && chatMessage.body!==undefined ?'__chatbot-body-title':'')">{{ chatMessage.title }}</div>
							<div *ngIf="chatMessage.body != null && chatMessage.body !== undefined">
								{{ chatMessage.body }}
							</div>
							<a href="#" class="link-inapp" *ngIf="chatMessage.open_url!==null && (chatMessage.url_resource_type == 'w' || chatMessage.url_resource_type == 'p') && chatMessage.show_as == 'l'"  (click)="openNewUrl(chatMessage.url_resource_type, chatMessage.open_url)">Read</a>

							<button ion-button class="btn-inapp" *ngIf="chatMessage.open_url!==null && (chatMessage.url_resource_type == 'w' || chatMessage.url_resource_type == 'p') && chatMessage.show_as == 'b'" (click)="openNewUrl(chatMessage.url_resource_type, chatMessage.open_url)">Action</button>
						</div>
					</div>
				</div>
				<div col-10 class="_chatbot-options" offset-1 *ngIf="chatMessage.options!==null && chatMessage.options!==undefined && chatMessage.options.length > 0">
					<ul class="_chatbot-action-container">
						<li *ngFor="let option of chatMessage.options" [ngStyle]="{'background-color': chatbotActionBgColor}" (click)="optionClick(option);">
							{{ option.title }}
						</li>
					</ul>
				</div>
				<div offset-2 no-padding class="blue-bubble-box" *ngIf="chatMessage.sender == 2">
					<div class="blue-bubble" [ngStyle]="{'background-color': userResponseBgColor}">
						<div class="bubble-content">
							<ul>
								<li>
									<span class="mini_label" *ngIf="chatMessage.label != null && chatMessage.label !== undefined">{{ chatMessage.label }}</span> {{ chatMessage.title }}
								</li>
							</ul>
						</div>
					</div>
					<span class="user-icon"><img src="assets/imgs/user-icon.png"></span>
				</div>
				<div class="clearfix"></div>
			</ng-template>
			<div class="clearfix"></div>
			<div col-11 class="bubble-container" *ngIf="showWave == true">
				<span class="bot-icon"><img src="assets/imgs/bot-icon.jpg"></span>
				<div class="white-bubble"><div class="bubble-content">
					<div id="wave"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
				</div></div>
			</div>
		</div>
		<div class="chatbot-footer">
			<div class="chatbot-form-element-container" *ngIf="currentInput != null && currentInput !== undefined">
				<div *ngIf="currentInput.type == '51'">
					<div class="bubble-container1">
						<div class="white-bubble">
							<div class="bubble-content1">
								<form [formGroup]="chatbotform">
									<ion-row>
										<ion-col col-9>
											<ion-input [type]="(currentInput.text_type == 1 || currentInput.text_type ==2 ?'text':'number')" ng-show="currentInput.text_type == 1 || currentInput.text_type ==2" formControlName="inputMessage" [(ngModel)]="currentInputResult" placeholder="Type message.." required></ion-input>
										</ion-col>
										<ion-col col-3 text-right>
											<button ion-button color="default" [disabled]="!chatbotform.valid" (click)="postInputData();"><ion-icon name="send"></ion-icon></button>
										</ion-col>
									</ion-row>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div class="__chatbot-send-message-div" *ngIf="currentInput.type == '53'">
					<div class="__chatbot-rangecontainer">
						<ion-label> You selected {{  currentInputResult }}</ion-label>
						<ion-range min="{{ currentInput.min_value }}" max="{{ currentInput.max_value }}" step="{{ currentInput.step }}" snaps="true" color="secondary" [(ngModel)]="currentInputResult">
							<ion-label range-left>{{ currentInput.min_value }}</ion-label>
	     					<ion-label range-right>{{ currentInput.max_value }}</ion-label>
						</ion-range>
					</div>
					<div class="__chatbot-send">
						<button ion-button full color="default" (click)="postInputData();"><ion-icon name="paper-plane"></ion-icon></button>
					</div>
				</div>
			</div>
		</div>
	</div>
`;
const CHATBOT_CSS = `
.clearfix::after {
content: "";
clear: both;
display: table;
}
.chatbot-container{
display: flex;
flex-direction: column;
height: 100%;
background-color: #f7f7f9;
}
.chatbot-direct-chat-messages {
overflow: auto;
padding: 10px;
flex-grow: 1;
}
.__chatbot-send-message-div{
margin: 5px 10px;
text-align: center;
position: relative;
display: flex;
border-radius: 20px;
border: 3px solid #ddd;
background: white;
overflow: hidden;
}
.__chatbot-send{
font-size: 20px;
float: left;
background: none;
display: flex;
align-items: center;
justify-content: center;
}
.__chatbot-send-message-div .__chatbot-send a {
margin: 0 10px;
color: blue;
}
.__chatbot-rangecontainer {
border: 0;
padding: 0px 15px;
outline: none;
font-size: 16px;
float: left;
flex-grow: 1;
}
.chatbot-footer{
width: 100%;
}
.bubble-container{
display: flex;
padding: 0;
flex-direction: row;
}
.bot-icon {
width: 25px;
height: 25px;
float: left;
margin-right: 5px;
flex-shrink: 0;
}
.bot-icon img {
width:100%;
height:auto;
border-radius: 50%;
}
.white-bubble, .blue-bubble {
background-color: #fff;
font-size: 16px;
border-top-left-radius: 0em;
border-top-right-radius: 0.5em;
border-bottom-left-radius: 0.5em;
border-bottom-right-radius: 0.5em;
padding-left: 0px;
margin: 0px 0px 6px 0px;
overflow: hidden;
}
.white-bubble{
box-shadow: 0px 2px 4px rgba(10,12,40,0.08);
-webkit-box-shadow: 0px 2px 4px rgba(10,12,40,0.08);
}
.blue-bubble-box{
display:flex;
padding:0;
float:right;
}
.blue-bubble {
background-color: #0084ff;
border-top-left-radius: 10px;
border-top-right-radius: 0px;
border-bottom-left-radius: 10px;
border-bottom-right-radius: 10px;
float: right;
color: #fff;
margin: 0px 0px 6px 0px;
}
.bubble-content {
padding: 8px 16px;
}
.blue-bubble ul{
margin: 0; padding: 0;list-style: none;
}
.user-icon {
float: right;
margin-left: 10px;
flex-shrink: 0;
}
.user-icon img {
width: 25px;
height: 25px;
border-radius: 50%;
display: block;
}
.image-wrapper img {
width: 100%;
height: auto;
display: block;
}
.image-content {
padding: 10px;
}
.mini_label{
font-size: 12px;margin-bottom: 3px;
}
.link-inapp{
margin: 0 !important;
color: #0084ff;
font-size: 20px;
}
.btn-inapp {
margin: 15px 10px 8px!important;
background-color:#fff;
color: #000;
background-color: #fff;
border-radius: 13px;
padding: 15px 25px;
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
._chatbot-options {
display: block;
}
._chatbot-options ._chatbot-action-container {
list-style-type: none;
margin: 0;
padding-left: 0px;
list-style-type: none;
display: flex;
align-items: flex-end;
flex-direction: column;
width: auto;
}
._chatbot-options ._chatbot-action-container li {
padding: 7px 21px;
background: #fff;
border: 1px solid #eaebf0;
border-radius: 20px;
margin-bottom: 6px;
width: auto;
float: right;
}
.chatbot-action-container{
text-align: right;
padding: 0 10px;
position:relative;
}
.__chatbot-body-title {
font-size: 15px;
font-weight: bold;
margin-bottom: 5px;
}
.__exit-buttonsInline {
list-style-type: none;
padding-left: 0px;
margin: 10px 0;
padding:0;
float:right;
}
.__exit-buttonsInline li {
display: inline-flex;
margin: 0 3px 3px;
}
.__exit-buttonsInline li a {
text-decoration: none;
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
/* ============ SPECIAL MESSAGES ============ */
.__chatbot-notification {
padding: 18px;
text-align: center;
background: rgba(142,106,220,1);
background: -moz-linear-gradient(45deg, rgba(142,106,220,1) 0%,
rgba(56,98,204,1) 100%);
background: -webkit-gradient(left bottom, right top, color-stop(0%,
rgba(142,106,220,1)), color-stop(100%, rgba(56,98,204,1)));
background: -webkit-linear-gradient(45deg, rgba(142,106,220,1) 0%,
rgba(56,98,204,1) 100%);
background: -o-linear-gradient(45deg, rgba(142,106,220,1) 0%,
rgba(56,98,204,1) 100%);
background: -ms-linear-gradient(45deg, rgba(142,106,220,1) 0%,
rgba(56,98,204,1) 100%);
background: linear-gradient(45deg, rgba(142,106,220,1) 0%,
rgba(56,98,204,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient(
startColorstr='#8e6adc', endColorstr='#3862cc', GradientType=1 );
}
.__chatbot-notification img {
width: 100px;
height: 100px;
}
.__chatbot-notification .__chatbot-body-title{
font-size:17px;
margin-bottom:10px;
}
.__chatbot-notification .image-content{
color:#fff;
}
/*successful bubble css*/
.__chatbot-successful {
padding: 18px;
text-align: center;
background: rgba(89,193,157,1);
background: -moz-linear-gradient(45deg, rgba(89,193,157,1) 0%,
rgba(129,231,125,1) 100%);
background: -webkit-gradient(left bottom, right top, color-stop(0%,
rgba(89,193,157,1)), color-stop(100%, rgba(129,231,125,1)));
background: -webkit-linear-gradient(45deg, rgba(89,193,157,1) 0%,
rgba(129,231,125,1) 100%);
background: -o-linear-gradient(45deg, rgba(89,193,157,1) 0%,
rgba(129,231,125,1) 100%);
background: -ms-linear-gradient(45deg, rgba(89,193,157,1) 0%,
rgba(129,231,125,1) 100%);
background: linear-gradient(45deg, rgba(89,193,157,1) 0%,
rgba(129,231,125,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient(
startColorstr='#59c19d', endColorstr='#81e77d', GradientType=1 );
}
.__chatbot-successful img {
width: 100px;
height: 100px;
}
/* end successful bubble css*/

/*warning bubble OR insight-message css*/
.insight-message-container {
background: linear-gradient(130.61deg, #E28664 9.1%, #D86862 46.23%,
#CA5D72 94.81%), linear-gradient(295.65deg, #FE744F 2.04%, #EE9E6C
94.14%);
border-top-left-radius: 0PX;
border-top-right-radius: 17px;
border-bottom-left-radius: 17px;
border-bottom-right-radius: 17px;
box-shadow: 0px 2px 4px rgba(10, 12, 40, 0.08);
-webkit-box-shadow: 0px 2px 4px rgba(10, 12, 40, 0.08);
//margin: 30px 46px 12px 10px;
overflow: hidden;
width: 100%;
padding:17px;
}
.insight-message-container .insight-icon {
float: left;
margin-right: 17px;
}
.insight-message-container .message-div {
overflow: hidden;
font-size: 16px;
color: #fff;
font-family: 'Merriweather-Regular';
line-height: 23px;
}
/* end warning bubble css*/
.__chatbot-fatal {
padding: 18px;
text-align: center;
background: rgba(238,157,107,1);
background: -moz-linear-gradient(-45deg, rgba(238,157,107,1) 0%,
rgba(254,116,114,1) 100%);
background: -webkit-gradient(left top, right bottom, color-stop(0%,
rgba(238,157,107,1)), color-stop(100%, rgba(254,116,114,1)));
background: -webkit-linear-gradient(-45deg, rgba(238,157,107,1) 0%,
rgba(254,116,114,1) 100%);
background: -o-linear-gradient(-45deg, rgba(238,157,107,1) 0%,
rgba(254,116,114,1) 100%);
background: -ms-linear-gradient(-45deg, rgba(238,157,107,1) 0%,
rgba(254,116,114,1) 100%);
background: linear-gradient(135deg, rgba(238,157,107,1) 0%,
rgba(254,116,114,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient(
startColorstr='#ee9d6b', endColorstr='#fe7472', GradientType=1 );
}
.__chatbot-fatal img {
width: 100px;
height: 100px;
}
`;
@Component({
	selector: 'chatbot',
	template: HTML_TEMPLATE,
	styles: [CHATBOT_CSS],
	providers: [ BRIQUEChatProvider ]
})
export class BRIQUEChatbot implements OnInit{

	@ViewChild(Content) contentArea: Content;
	@ViewChild('list') messagesList: ElementRef;
	// // @ViewChild(List, {read: ElementRef}) chatList: ElementRef;
 	// private mutationObserver: MutationObserver;

	@Input('customerCode') customerCode: string;
	@Input('botCode') botCode: string;
	@Input('runMode') runMode: number;
    @Input('apiEndpoint') apiEndpoint: string;

	initiateEndpoint: string;
    initiateResponse: string;

	postRouteResponseEndpoint: string;
	postRRResponse: string;

	postSubjectSelectionEndpoint: string;
	postSSResponse: string;

	// These are the most important blocks
	chatbotName: string;
	chatbotTagline: string;

	currentBlock: MdlChatBlock;
	currentBlockMessages: any[] = [];

	chatMessages: any[] = [];
	chatMessageOptions: any[] =[];
	formResponseArray: any[] =[];
	showWave: boolean = true;
	currentInput: any = null;
	currentInputResult: any = null;
	currentMessage: any = null;
	exitRoutes: any[] = [];
	//
	exitMessage: string;
	currentBlockMessageIndex=0;
	subjects=[];

	currentSelection=1;
	chatbotImage = "";

	// Chatbot Settings
	chatbotSubjectQuestion: string;
	// chatbotSettings: any[] = [];
	chatbotActionBgColor: string;
	userResponseBgColor: string;

	// exit Condition variable
	exitMessages=[];
	chatbotEndConvQuestion: string;
	chatbotEndConvStatement: string;

	private chatbotform : FormGroup;
	constructor(private navCtrl: NavController,
        private navParams:NavParams,
        private chatProvider: BRIQUEChatProvider,
		private formBuilder: FormBuilder) {
			this.chatbotform = this.formBuilder.group({
		      inputMessage: [null, Validators.required],
		    });
	}
	ngOnInit() {
		console.log("CC:"+this.customerCode+"===BC:"+this.botCode+"===RM:"+this.runMode+"===AE:"+this.apiEndpoint);
        if( this.customerCode == null || this.customerCode === undefined || this.customerCode.trim().length == 0 ||
			this.botCode == null || this.botCode === undefined ||
			this.runMode == null ||
			this.apiEndpoint == null || this.apiEndpoint == null || this.apiEndpoint === undefined || this.apiEndpoint.trim().length == 0 )
            throw new Error("Improper Chatbot registration. Please provide the customer code, bot code and the endpoint URL.");
		this.registerChatbot();
	}

	// when the component gets the focus back
	public ionViewDidEnter(){

	}

    // Call to register the chatbot
	private registerChatbot(){
		this.initiateChatbot();
	}

	// Reset the blocks
	private resetBlocks(){
		this.currentBlock = null;
		this.currentInput = null;
		this.exitMessage="";
		this.exitRoutes =[];
		this.currentBlockMessageIndex=0;
		this.chatMessageOptions =[];
	}

	// Call to initiate the chat
	private initiateChatbot(){
		this.chatProvider.initiateChatbot(this.customerCode, this.botCode, this.runMode, this.apiEndpoint).then(data=>{
            console.log("Initiate chatbot data from the server.");
            // console.log(data);
			// console.log("set bot session id "+data['bot_session_id']);
			localStorage.setItem("bot_session_id", data['bot_session_id']);
			this.resetBlocks();
			if( data.hasOwnProperty("chatbot") && data["chatbot"] != null && data["chatbot"] !== undefined ){
				let chatbot = data["chatbot"];
				this.chatbotName = chatbot["bot_name"];
				this.chatbotTagline = chatbot['tagline'];
				// ----------------------------------
				// Manage chatbot settings
				if( chatbot.hasOwnProperty("settings") && chatbot["settings"] != null && chatbot["settings"] !== undefined ){
					let settings = chatbot['settings'];
					this.chatbotActionBgColor = chatbot['settings']['actions_bg_color'];
					this.userResponseBgColor = chatbot['settings']['user_response_bg_color'];
					// Subject Question
					if( settings.hasOwnProperty("show_subjects_question") && settings["show_subjects_question"] != null && settings["show_subjects_question"] !== undefined )
						this.chatbotSubjectQuestion = chatbot['settings']['show_subjects_question'];
					// Like Is anything  that may i help you?
					if( settings.hasOwnProperty("end_conversation_question") && settings["end_conversation_question"] != null && settings["end_conversation_question"] !== undefined )
						this.chatbotEndConvQuestion = chatbot['settings']['end_conversation_question'];
					// If No then show Ok,have a nice day
					if( settings.hasOwnProperty("end_conversation_statement") && settings["end_conversation_statement"] != null && settings["end_conversation_statement"] !== undefined )
						this.chatbotEndConvStatement = chatbot['settings']['end_conversation_statement'];
				}
			}
			// ----------------------------------
			// Manage chatbot Greetings here
			if( data.hasOwnProperty("greeting") && data["greeting"] != null && data["greeting"] !== undefined ){
				let greeting = data["greeting"];
				if( greeting.hasOwnProperty("block") && greeting["block"] != null && greeting["block"] !== undefined ){
					this.processResponse(greeting);
					let block = greeting['block'];
					// If chatbot having exist routes
					if( block.hasOwnProperty("exit_message") && block["exit_message"] != null && block["exit_message"] !== undefined){
						this.exitMessage = block["exit_message"];
						this.exitRoutes = block["routes"];
					}
				}
				// ----------------------------------------------
				// Manage subjects here
				// PENDING: need to take a good look at this
				// if( greeting.hasOwnProperty("subjects") && greeting["subjects"]!= null && greeting["subjects"] !== undefined ){
				// 	this.subjects = greeting["subjects"];
				// }
			}
        });
	}

	//-------------------------------------
	//  Process the response
	//-------------------------------------
	private processResponse(_data){
		// console.log("process Response");
		// console.log(_data);
		// if status == 1, routes are still coming
		// if status == 2, time to show subjects
		// if status == 3, time to rewind
		if( _data.hasOwnProperty("block") && _data["block"]!= null && _data["block"] !== undefined ){
			this.currentBlock = new MdlChatBlock(_data["block"]);
			this.currentInput = null;
			this.currentSelection = _data["status"];
			if(_data["status"] == "1"){
				this.currentBlockMessages = this.currentBlock.messages;
				this.currentBlockMessageIndex = 0;
				let blockObject = _data["block"];
				if( blockObject.hasOwnProperty("routes") && blockObject['routes']!= null && blockObject['routes']!== undefined ){
					this.exitRoutes = blockObject['routes'];
					this.exitMessage = blockObject['exit_message'];
				}
				this.processNextMessage();
			}
			else if(_data["status"] == "2"){
				this.currentBlockMessages = this.currentBlock.messages;
				this.currentBlockMessageIndex = 0;
				this.subjects = _data["subjects"];
				if(this.currentBlockMessages.length > 0){
					this.processNextMessage();
				}
				else if(this.subjects.length > 0){
					this.showSubjects();
				}
			}
			else if(_data["status"] == "3"){
				if( _data['block']['messages'] != null && _data['block']['messages'] != undefined ){
					this.currentBlockMessages = _data['block']['messages'];
					this.currentBlockMessageIndex = 0;
				}
				if(this.currentBlockMessages.length > 0)
					this.processNextMessage();
				else
				  	this.showEndConversation();
			}
		}//end if check data having block
	}

	// -----------------------------------------------------
	// Processes the chat block, push all the chat messages
	private processNextMessage(){
		if( this.currentBlockMessages != null && this.currentBlockMessages.length > 0 ){
			if ( this.currentBlockMessageIndex >= this.currentBlockMessages.length){
				// Time to show the subjects and return
				// console.log("processNextMessage currentSelection :: "+this.currentSelection);
				this.showWave = true
				if( this.currentSelection == 1 ){
					if( this.exitRoutes != null && this.exitRoutes.length > 0 ){
						this.showExitMessage();
					}
				}
				else if( this.currentSelection == 2 ){
					this.showSubjects();
				}
				else{
					// This may mean that the conversation may have ended
					this.showEndConversation();
				}
				return;
			}
			this.showWave = true;
			// Lets add the message
			let blockMessage = this.currentBlockMessages[this.currentBlockMessageIndex];
			// console.log(blockMessage);
			blockMessage.sender = 1;
			if( blockMessage.hasOwnProperty("message_id") )
				blockMessage.message_id = blockMessage["message_id"];
			else
				blockMessage.message_id = Date.now();
			setTimeout(() => {
				this.chatMessages.push(blockMessage);
				this.showWave = false;
				this.currentBlockMessageIndex++;
				if( !blockMessage.hasOwnProperty("form") )
					this.processNextMessage();
				else{
					if( blockMessage["type"] == "3" ){
						this.currentInput = blockMessage["form"][0];
						if( blockMessage["subtype"] == "51" ){
							// console.log("get input subtype 51");
							// console.log(blockMessage);
							this.currentInput['form_id'] = blockMessage["form_id"];
							this.currentInput['message_id'] = blockMessage["message_id"];
						}
						else if( blockMessage["subtype"] == "52" ){
							this.currentInput['form_id'] = blockMessage["form_id"];
							this.currentInput['message_id'] = blockMessage["message_id"];
							let choice = blockMessage["form"][0];
							let _options = choice.options;
							for( let _option of _options ){
								if(_option.post_entry_message!=="undefined"){
									var route = { block_route_id: 0, type: choice.type, title: _option.text, response_label:choice.pre_id, post_entry_message: _option.post_entry_message };
									this.chatMessageOptions.push(route);
								}
							}
							blockMessage['options'] = this.chatMessageOptions;
							this.currentMessage = blockMessage;
						}
					}
				}
				this.scrollPageToBottom();
			}, blockMessage.showafter);
		}
		else{
			if( this.exitRoutes != null && this.exitRoutes.length > 0 ){
				this.showWave = true;
				this.showExitMessage();
			}
			this.scrollPageToBottom();
		}
	}

	// Show the subjects
	private showSubjects(){
		// console.log("calling show subjects");
		this.chatProvider.showSubjects(this.customerCode, this.botCode, this.runMode, this.apiEndpoint).then(data=>{
			if( data.hasOwnProperty('subjects')){
				this.subjects = data['subjects'];
				this.showWave = true;
				// remove message option and reset new options
				this.currentMessage =[]; this.chatMessageOptions =[];
				let subjectQuestion = this.chatbotSubjectQuestion;
				var message = { title: subjectQuestion, sender:"1", type: "1", subtype:'1',showafter:500,options:[] };

				setTimeout(()=>{
					this.showWave = false;
					// Show the actions
					for(let subject of this.subjects){
						var route = { block_route_id: subject.subject_id, type: '101', title: subject.subject_title };
						this.chatMessageOptions.push(route);
					}
					message.options = this.chatMessageOptions;
					this.chatMessages.push(message);
					// set current message
					this.currentMessage = message;
					this.scrollPageToBottom();
				}, 1000);
			}
		});
	}

	private showExitMessage(){
		this.chatMessageOptions = [];
		if(this.exitMessage!= null){
			var message = { title: this.exitMessage, sender:"1", type: "101", subtype:'1',showafter:1000,options:[] };
			setTimeout(()=>{
				this.showWave = false;
				// Show the actions
				// For exit conversation if no - show  chatbot settings
				for(let exitRoute of this.exitRoutes){
					var route = { block_route_id: exitRoute.block_route_id, type: '100', title: exitRoute.title, 'block_id':exitRoute.block_id, 'route_id':exitRoute.block_route_id};
					this.chatMessageOptions.push(route);
				}
				message.options = this.chatMessageOptions;
				this.chatMessages.push(message);
				// set current message
				this.currentMessage = message;
				this.scrollPageToBottom();
			}, 1000);
		}
	}
	private showEndConversation(){
		this.chatMessageOptions = [];
		if(this.chatbotEndConvQuestion != null){
			var message = { title: this.chatbotEndConvQuestion, sender:"1", type: "1", subtype:'1',showafter:1000,options:[] };
			setTimeout(()=>{
				this.showWave = false;
				// this.chatMessages.push(message);
				// Show the actions
				// For exit conversation if no - show  chatbot settings
				this.chatMessageOptions.push({ block_route_id: -1, type: "-1", title: "yes" }, { block_route_id: -2, type: "-1", title: "no" });
				message.options = this.chatMessageOptions;
				this.chatMessages.push(message);
				// set current message
				this.currentMessage = message;
				this.scrollPageToBottom();
			}, 1000);
		}
	}

	private optionClick(chatbotAction: any){
		// console.log("option click action");
		this.showWave = true;
		if(this.currentMessage.hasOwnProperty('options'))
			this.currentMessage.options =[];
		this.chatMessageOptions =[];
		if( chatbotAction.type == '100'){
			// console.log("optionClick take action 100");
			this.postRouteResponse(chatbotAction);
		}
		else if( chatbotAction.type == '101' ){
			// console.log("optionClick take action 101");
			// Subject was selected
			this.postSubjectSelection(chatbotAction);
		}
		else if( chatbotAction.type == '102' ){
			// console.log("optionClick take action 102");
			// here is chatBot single choice
		}
		else if( chatbotAction.type == '52' ){
			// route was selected
			// console.log("optionClick take action 52");
			this.postSingleFormResponse(chatbotAction.title, chatbotAction.response_label, chatbotAction);
		}
		else if(chatbotAction.type == '9999'){
			// console.log("optionClick take action 9999");
			this.resetBlocks();
			this.showSubjects();
			this.currentSelection = 2;
			let chatMessages = this.chatMessages;
			chatMessages.pop(); //Remove last element from chatMessage
		}
		else{
			let chatMessages = this.chatMessages;
			chatMessages.pop(); //Remove last element from chatMessage
			// This function called when exit route response comes
			// Like Yes/No
			this.showWave = true;
			this.resetBlocks();
			setTimeout(()=>{
				this.showWave = false;
				if(chatbotAction.title=='yes'){
					this.showSubjects();
					this.currentSelection = 2;
				}
				else{
					this.showRestartConversation();
				}
			}, 1000);
		}
	}

	private openNewUrl(type:string,externalURL:string){
		console.log(type +" url "+externalURL);
		if(type == 'w'){
			//Use in app browser
			//show external url
			// console.log(" show external URL");
		}
		if(type == 'p'){
			// Need to handle errors
		 	//show ionic page
			let chatbotObject = localStorage.getItem("chatbotobject");
		 	this.navCtrl.push(externalURL, {'chatbotobject':chatbotObject}).then(
		      response => {
		        console.log('Response ' + response);
		      },
		      error => {
		        console.log('Error: ' + error);
		      }
		    ).catch(exception => {
			      console.log('Exception ' + exception);
			});
		 	console.log("IONIC PAGE URL");
	 	}
	}

	// --------------------------------------------
	// When user select particular subject
	// Get conversation about according to subject
	private postSubjectSelection(chatbotAction: any){
		this.resetBlocks();
		this.showMyResponse(chatbotAction.title, null);
		this.chatProvider.postSubjectSelection(this.customerCode, this.botCode, this.runMode, this.apiEndpoint, chatbotAction.block_route_id).then(data=>{
			this.processResponse(data);
		});
	}

	// --------------------------------------
	// Manage Exit Route response
	private postRouteResponse(chatbotAction: any){
		this.resetBlocks();
		this.showMyResponse(chatbotAction.title, null);
		let currentInput = this.currentInput;
		this.chatProvider.postRouteResponse(this.customerCode, this.botCode, this.runMode, this.apiEndpoint, chatbotAction.block_id, chatbotAction.route_id, this.currentSelection).then(data=>{
			this.processResponse(data);
		});
	}

	// -----------------------------------
	// Single form response
	private postSingleFormResponse(value: string, key: string, chatbotAction : any){
		this.formResponseArray = [];
		let currentInput = this.currentInput;
		let block_id = this.currentBlock.block_id;
		this.showMyResponse(value, key); //show selected option text
		let nextMessage = {};
		// This should typically come after server call
		if(chatbotAction!= null && chatbotAction.hasOwnProperty("post_entry_message")){
			if(chatbotAction.post_entry_message!==undefined && chatbotAction.post_entry_message!=="undefined" && chatbotAction.post_entry_message!==null)
				nextMessage = { title: chatbotAction.post_entry_message, sender:"1", type: "1", subtype:'1',showafter:1000 };
		}
		if(currentInput!= null && currentInput.hasOwnProperty("form_id") && currentInput.hasOwnProperty("message_id")){
			this.formResponseArray.push({ 'block_id':block_id, 'form_id': currentInput.form_id, 'value': value });
			this.chatProvider.postFormResponse(this.customerCode, this.botCode, this.runMode, this.apiEndpoint, this.formResponseArray, currentInput.message_id).then(data=>{
				// console.log("post form response");
				// console.log(data);
				let responseData = data;
				if(data instanceof Array)
					responseData = data[0];
				if(responseData['status'] == 1 && responseData.hasOwnProperty("block") && responseData["block"]!= null && responseData["block"] !== undefined ){
					let block = responseData['block'];
					// console.log("************Displaying block");
					// console.log(block);
					if(block.hasOwnProperty('messages')){
						this.showWave = true;
						var i=0;
						for( let _message of block['messages']){
							// console.log(_message);
							this.showBotResponse(_message);
							i++;
						}
						// Now show the next message
						this.showBotResponse(nextMessage);
						if(i == block['messages'].length)
							this.processNextMessage();
					}
					else{
						// Now show the next message
						this.showBotResponse(nextMessage);
						// here is pending to manage subpressed in processNextMessage
						this.processNextMessage();
					}
				}
				else{
					// Now show the next message
					this.showBotResponse(nextMessage);
					this.processNextMessage();
				}
			});
		}
	}

	//----------------------------------
	// When user enter value in
	private postInputData(){
		this.showWave = true;
		// console.log("post input data called ");
		// console.log(this.currentInputResult);
		this.postSingleFormResponse(this.currentInputResult, this.currentInput.pre_id, this.currentInput);
		this.currentInputResult =null;
		this.currentInput = null;
	}

	// --------------------------------
	// Show user response
	private showMyResponse(myResponse: string, responseLabel: string){
		this.chatMessages.push({ title: myResponse, label: responseLabel, type: 1, sender: 2 });
        this.scrollPageToBottom();
	}

	// -----------------------------------------------------
	// Show Bot response When user answer to your question
	private showBotResponse(botResponseMessage){
		this.showWave = true;
		setTimeout(()=>{
			this.showWave = false;
			this.chatMessages.push(botResponseMessage);
			this.scrollPageToBottom();
		}, 1000);
	}
	// ------------------------------------
	// Restart the conversation
	private showRestartConversation(){
		this.showWave = true;
		this.currentMessage =[];
		var title = this.chatbotEndConvStatement;
		var message = { title: title, sender:"1", type: "1", subtype:'1', showafter:1000, options:[] };
		setTimeout(()=>{
			this.showWave = false;
			message.options.push({ block_route_id: -1, type: '9999', title: "Restart" });
			this.currentSelection = 0;
			this.scrollPageToBottom();
			this.chatMessages.push(message);
			this.currentMessage = this.chatMessages;

		}, 1000);
	}

	// ----------------------------------
	// Scroll to top
	private scrollPageToBottom(){
		setTimeout(()=>{
			// this.contentArea.scrollToBottom();
			try {
	            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
	        } catch(err) { }
		}, 50);
	}
}
