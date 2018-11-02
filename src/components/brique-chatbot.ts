import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { BRIQUEChatProvider } from '../providers/chat-provider';
import { MdlChatBlock } from './chat-block';
// import { CMPChatAction } from './chat-action';, MdlChatMessage

// TO Build
// npm uninstall ionic-umbrellium-chatbot && npm install /home/jay/IONIC/chatbot-plugin/ionic-umbrellium-chatbot
const HTML_TEMPLATE = `
	<div class="chatbot-container" #content>
		<div #list class="list chatbot-direct-chat-messages" [scrollTop]="list.scrollHeight">
			<ng-template ngFor let-chatMessage [ngForOf]="chatMessages">
				<div col-10 class="bubble-container" *ngIf="chatMessage.sender == 1">
					<div class="white-bubble">
						<div class="image-wrapper" *ngIf="chatMessage.include_image !== undefined && chatMessage.include_image==1 && chatMessage.resource_type !== undefined && chatMessage.resource_type == 'i' && chatMessage.resource_url.length > 0">
						  <img src='{{ chatMessage.resource_url}}' class="__chatbot-image" alt="">
						</div>
						<div [ngClass]="(chatMessage.include_image!= null && chatMessage.include_image !== undefined && chatMessage.include_image==1 && chatMessage.resource_type!==undefined && chatMessage.resource_type == 'i' ?'image-content ':'bubble-content')">
							<span [ngClass]="(chatMessage.title!= null && chatMessage.title !== undefined && chatMessage.body!= null && chatMessage.body!==undefined ?'__chatbot-body-title':'')">{{ chatMessage.title }}</span>
							<span *ngIf="chatMessage.body != null && chatMessage.body !== undefined">
								{{ chatMessage.body }}
							</span>
							<a href="{{ chatMessage.open_url }}" *ngIf="chatMessage.open_url!==null && chatMessage.url_resource_type == 'w' && chatMessage.show_as == 'l'" class="btn-inapp" (click)="openNewUrl(chatMessage.url_resource_type, chatMessage.open_url)">Link</a>
							<button ion-button *ngIf="chatMessage.open_url!==null && chatMessage.url_resource_type == 'w' && chatMessage.show_as == 'b'" (click)="openNewUrl(chatMessage.url_resource_type, chatMessage.open_url)">button</button>
						</div>
					</div>
				</div>
				<div offset-2 no-padding *ngIf="chatMessage.sender == 2">
					<div class="blue-bubble"><div class="bubble-content">
						<ul><li class="mini_label" *ngIf="chatMessage.label != null && chatMessage.label !== undefined">{{ chatMessage.label }}</li><li>{{ chatMessage.title }}</li></ul>
					</div></div>
				</div>
				<div class="clearfix"></div>
			</ng-template>
			<div class="clearfix"></div>
			<div col-10 class="bubble-container" *ngIf="showWave == true">
				<div class="white-bubble"><div class="bubble-content">
					<div id="wave"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
				</div></div>
			</div>
		</div>
		<div class="chatbot-footer">
			<div class="chatbot-action-container" *ngIf="chatbotActions.length > 0">
				<ul class='__exit-buttonsInline'>
					<li *ngFor="let chatbotAction of chatbotActions"><a href="#" class="__chatbot-action-button" (click)="optionClick(chatbotAction);">{{ chatbotAction.title }}</a></li>
				</ul>
			</div>
			<div class="chatbot-form-element-container" *ngIf="currentInput != null && currentInput !== undefined">
				<div *ngIf="currentInput.type == '51'">
					<ion-textarea rows="1" autosize [(ngModel)]="currentInputResult"></ion-textarea>
					<button ion-button full col-3 color="default" class="btn-send" (click)="postInputData();"><ion-icon name="send"></ion-icon></button>
				</div>
				<div *ngIf="currentInput.type == '53'">
					<ion-label>{{ currentInputResult }}</ion-label>
					<ion-range col-9 min="{{ currentInput.min }}" max="{{ currentInput.max }}" step="{{ currentInput.step }}" snaps="true" color="secondary" [(ngModel)]="currentInputResult"></ion-range>
					<button col-3 (click)="postInputData();">Send</button>
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
}
ion-content{
background-color: #f3f3f3;
}
.chatbot-direct-chat-messages {
overflow: auto;
padding: 10px;
flex-grow: 1;
}
.chatbot-footer{
width: 100%;
}
.bubble-container{
display: block;
padding: 0;
}
.white-bubble, .blue-bubble {
background-color: #fff;
font-size: 15px;
border-top-left-radius: 0em;
border-top-right-radius: 0.5em;
border-bottom-left-radius: 0.5em;
border-bottom-right-radius: 0.5em;
box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.35);
-webkit-box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.35);
width: auto;
display: inline-block;
float: left;
padding-left: 0px;
margin: 0px 0px 4px 0px;
overflow: hidden;
}
.blue-bubble {
background-color: #0084ff;
border-top-left-radius: 0.5em;
border-top-right-radius: 0em;
float: right;
color: #fff;
margin: 0px 0px 5px 0px;
}
.bubble-content {
padding: 10px;
display: flex;
flex-grow: 1;
}
.blue-bubble ul{
margin: 0; padding: 0;list-style: none;
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
.btn-inapp {
margin: 0 !important;
color: #656565;
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
.__chatbot-body-title {
font-size: 15px;
font-weight: bold;
margin-bottom: 5px;
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
	mode: string = "mobile";
    @Input('apiEndpoint') apiEndpoint: string;

	initiateEndpoint: string;
    initiateResponse: string;

	postRouteResponseEndpoint: string;
	postRRResponse: string;

	postSubjectSelectionEndpoint: string;
	postSSResponse: string;

	// These are the most important blocks
	chatbotName: string;
	chatbotSubjectQuestion: string;
	chatbotTagline: string;

	currentBlock: MdlChatBlock;
	currentBlockMessages: any[] = [];
	chatbotSettings: any[] = [];
	chatMessages: any[] = [];
	chatbotActions: any[] =[];
	showWave: boolean = true;
	currentInput: any = null;
	currentInputResult: any = null;
	exitRoutes: any[] = [];
	//
	exitMessage={};
	currentBlockMessageIndex=0;
	subjects=[];

	currentSelection=1;
	chatbotImage = "";

	// exit Condition variable
	exitMessages=[];
	chatbotEndConvQuestion: string;
	chatbotEndConvStatement: string;

	constructor(private navCtrl: NavController,
        private navParams:NavParams,
        private chatProvider: BRIQUEChatProvider) {
	}
	ngOnInit() {
		// this.customerCode 	= this.navParams.get("customerCode");
		// this.botCode 		= this.navParams.get("botCode");
		// this.runMode 		= this.navParams.get("runMode");
		this.mode = "mobile";
        // this.apiEndpoint	= this.navParams.get("apiEndpoint");
		console.log("CC:"+this.customerCode+"===BC:"+this.botCode+"===RM:"+this.runMode+"===AE:"+this.apiEndpoint);
        if( this.customerCode == null || this.customerCode === undefined || this.customerCode.trim().length == 0 ||
			this.botCode == null || this.botCode === undefined ||
			this.runMode == null ||
			this.apiEndpoint == null || this.apiEndpoint == null || this.apiEndpoint === undefined || this.apiEndpoint.trim().length == 0 )
            throw new Error("Improper Chatbot registration. Please provide the customer code, bot code and the endpoint URL.");
		this.registerChatbot();
	}

    // Call to register the chatbot
	private registerChatbot(){
		this.initiateChat();
	}

	// Reset the blocks
	private resetBlocks(){
		this.currentBlock = null;
		this.currentInput = null;
		this.exitMessage={};
		this.currentBlockMessageIndex=0;
		this.chatbotActions = [];
	}

    // Call to initiate the chat
	private initiateChat(){
		// console.log("Call to initiate the chat");
		this.chatProvider.initiateChat(this.customerCode, this.botCode, this.runMode, this.mode, this.apiEndpoint).then(data=>{
            // console.log("Got the data from the server.");
            // console.log(data);
			this.resetBlocks();
			if( data.hasOwnProperty("chatbot") && data["chatbot"] != null && data["chatbot"] !== undefined ){
				let chatbot = data["chatbot"];
				this.chatbotName = chatbot["bot_name"];
				this.chatbotTagline = chatbot['tagline'];
				if( chatbot.hasOwnProperty("settings") && chatbot["settings"] != null && chatbot["settings"] !== undefined ){
					this.chatbotSettings = chatbot['settings'];
					this.chatbotSubjectQuestion = chatbot['settings']['show_subjects_question'];
					this.chatbotEndConvQuestion = chatbot['settings']['end_conversation_question'];
					this.chatbotEndConvStatement = chatbot['settings']['end_conversation_statement'];
				}
			}
			if( data.hasOwnProperty("greeting") && data["greeting"] != null && data["greeting"] !== undefined ){
				let greeting = data["greeting"];
				if( greeting.hasOwnProperty("block") && greeting["block"] != null && greeting["block"] !== undefined ){
					this.extractResponse(greeting);
				}
				// PENDING: need to take a good look at this
				if( greeting.hasOwnProperty("subjects") && greeting["subjects"] != null && greeting["subjects"] !== undefined ){
					this.subjects = greeting["subjects"];
				}
			}
        });
	}

	// Extract the response
	private extractResponse(_data){
		this.currentBlock = new MdlChatBlock(_data["block"]);
		this.currentInput = null;
		this.currentBlockMessages = this.currentBlock.messages;
		this.currentBlockMessageIndex = 0;
		this.currentSelection = _data["status"];
		this.processNextMessage();
	}

	// Processes the chat block, push all the chat messages
	private processNextMessage(){
		if( this.currentBlockMessages != null && this.currentBlockMessages.length > 0 ){
			if ( this.currentBlockMessageIndex >= this.currentBlockMessages.length){
				// Time to show the subjects and return
				// console.log("currentSelection :: "+this.currentSelection);
				if( this.currentSelection == 1 ){
					if( this.chatbotActions != null && this.chatbotActions.length > 0 ){
						// showExitMessage();
						// console.log("ShowExitMessage");
					}
				}
				else if( this.currentSelection == 2 ){
					this.showWave = true;
					this.showSubjects();
				}
				else{
					this.showWave = true
					// This may mean that the conversation may have ended
					this.showEndConversation();
				}
				return;
			}
			this.showWave = true;
			// Lets add the message
			let blockMessage = this.currentBlockMessages[this.currentBlockMessageIndex];
			blockMessage.sender = 1;
			blockMessage.message_id = Date.now();
			setTimeout(() => {
				this.chatMessages.push(blockMessage);
				this.showWave = false;
				this.currentBlockMessageIndex++;
				if( !blockMessage.hasOwnProperty("form") )
					this.processNextMessage();
				else{
					if( blockMessage["type"] == "3" ){
						if( blockMessage["subtype"] == "51" ){
							this.currentInput = blockMessage["form"][0];
						}
						else if( blockMessage["subtype"] == "52" ){
							let choice = blockMessage["form"][0];
							let _options = choice.options.split(":");
							for( let _option of _options ){
								var route = { block_route_id: 0, type: choice.type, title: _option, response_label: choice.id };
								this.chatbotActions.push(route);
							}
						}
						else if( blockMessage["subtype"] == "53" ){
							this.currentInput = blockMessage["form"][0];
						}
					}
				}
				this.scrollPageToBottom();
			}, blockMessage.showafter);
		}
		else{
			// Time to show exit message or subjects
			this.scrollPageToBottom();
		}
	}

	// Show the subjects
	private showSubjects(){
		let settings = this.chatbotSettings;
		let subjectQuestion = this.chatbotSubjectQuestion;
		var message = { title: subjectQuestion, sender:"1", type: "1", subtype:'1',showafter:500 };
		setTimeout(()=>{
			this.showWave = false;
			this.chatMessages.push(message);
			// Show the actions
			for(let subject of this.subjects){
				var route = { block_route_id: subject.subject_id, type: '101', title: subject.subject_title };
				this.chatbotActions.push(route);
			}
			this.scrollPageToBottom();
		}, 500);
	}

	private showEndConversation(){
		if(this.chatbotEndConvQuestion != null){
			var message = { title: this.chatbotEndConvQuestion, sender:"1", type: "1", subtype:'1',showafter:1000 };
			setTimeout(()=>{
				this.showWave = false;
				this.chatMessages.push(message);
				// Show the actions
				// For exit conversation if no - show  chatbot settings
				this.chatbotActions.push({ block_route_id: -1, type: "-1", title: "yes" }, { block_route_id: -2, type: "-1", title: "no" });
				this.scrollPageToBottom();
			}, 1000);
		}
	}

	private optionClick(chatbotAction: any){

		console.log("chatbotAction");
		console.log(chatbotAction);
		if( chatbotAction.type == '101' ){
			// Subject was selected
			this.postSubjectSelection(chatbotAction);
		}
		else if( chatbotAction.type == '102' ){
		}
		else if( chatbotAction.type == '52' ){
			// route was selected
			// console.log("some sort of a route clicked");
			// console.log(chatbotAction);
			this.postFormResponse(chatbotAction.title, chatbotAction.response_label);
		}
		else{
			// This function called when exit route response comes
			// Like Yes/No
			var title = this.chatbotEndConvStatement;
			if(chatbotAction.title=='yes')
				title = "I can't help you, Please contact to your administrator.";
			var message = { title: title, sender:"1", type: "1", subtype:'1',showafter:1000 };
			this.showBotResponse(chatbotAction, message);
		}
	}

	private openNewUrl(type:string,externalURL:string){
		console.log(type +" url "+externalURL);
		if(type == 'w'){
			//show external url
		}
		if(type == 'p'){
		 //show ionic page
	 	}
	}

	private postSubjectSelection(chatbotAction: any){
		this.resetBlocks();
		this.showMyResponse(chatbotAction.title, null);
		this.chatProvider.postSubjectSelection(this.customerCode, this.botCode, this.runMode, this.apiEndpoint, chatbotAction.block_route_id).then(data=>{
			// console.log("Subject response data");
			// console.log(data);
			this.extractResponse(data);
		});
	}

	private postFormResponse(value: string, key: string){
		this.chatbotActions = [];
		// console.log("posting form choice");
		this.showMyResponse(value, key);
		this.processNextMessage();
	}

	private postInputData(){
		// console.log("posting input data");
		// console.log(this.currentInputResult);
		this.postFormResponse(this.currentInputResult, this.currentInput.id);
		this.currentInput = null;
	}

	// --------------------------
	private showMyResponse(myResponse: string, responseLabel: string){
		this.chatMessages.push({ title: myResponse, label: responseLabel, type: 1, sender: 2 });
        this.scrollPageToBottom();
	}

	// -----------------------------------------------------
	// Show Bot response When user answer to your question
	private showBotResponse(chatbotAction, botResponseMessage){
		this.resetBlocks();
		this.showMyResponse(chatbotAction.title, null);
		this.showWave = true;
		setTimeout(()=>{
			this.showWave = false;
			this.chatMessages.push(botResponseMessage);
			this.scrollPageToBottom();
		}, 1000);
	}

	private scrollPageToBottom(){
		setTimeout(()=>{
			// this.contentArea.scrollToBottom();
			try {
	            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
	        } catch(err) { }
		}, 50);
	}
}
