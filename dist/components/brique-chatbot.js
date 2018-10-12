import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { BRIQUEChatProvider } from '../providers/chat-provider';
import { MdlChatBlock } from './chat-block';
// import { CMPChatAction } from './chat-action';, MdlChatMessage
var HTML_TEMPLATE = "\n<ion-header>\n\t<ion-navbar>\n\t\t<ion-title>\n\t\t\t{{ chatbotName }}\n\t\t</ion-title>\n\t</ion-navbar>\n</ion-header>\n<ion-content #content no-padding>\n\t<div class=\"chatbot-container\">\n\t\t<div #list class=\"list chatbot-direct-chat-messages\" [scrollTop]=\"list.scrollHeight\">\n\t\t\t<ng-template ngFor let-chatMessage [ngForOf]=\"chatMessages\">\n\t\t\t\t<div col-10 class=\"bubble-container\" *ngIf=\"chatMessage.sender == 1\">\n\t\t\t\t\t<div class=\"white-bubble\"><div class=\"bubble-content\"><span>{{ chatMessage.title }}</span></div></div>\n\t\t\t\t</div>\n\t\t\t\t<div offset-2 no-padding *ngIf=\"chatMessage.sender == 2\">\n\t\t\t\t\t<div class=\"blue-bubble\"><div class=\"bubble-content\">\n\t\t\t\t\t\t<ul><li class=\"mini_label\" *ngIf=\"chatMessage.label != null && chatMessage.label !== undefined\">{{ chatMessage.label }}</li><li>{{ chatMessage.title }}</li></ul>\n\t\t\t\t\t</div></div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"clearfix\"></div>\n\t\t\t</ng-template>\n\t\t\t<div class=\"clearfix\"></div>\n\t\t\t<div col-10 class=\"bubble-container\" *ngIf=\"showWave == true\">\n\t\t\t\t<div class=\"white-bubble\"><div class=\"bubble-content\">\n\t\t\t\t\t<div id=\"wave\"><span class=\"dot\"></span><span class=\"dot\"></span><span class=\"dot\"></span></div>\n\t\t\t\t</div></div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"chatbot-footer\">\n\t\t\t<div class=\"chatbot-action-container\" *ngIf=\"chatbotActions.length > 0\">\n\t\t\t\t<ul class='__exit-buttonsInline'>\n\t\t\t\t\t<li *ngFor=\"let chatbotAction of chatbotActions\"><a href=\"#\" class=\"__chatbot-action-button\" (click)=\"optionClick(chatbotAction);\">{{ chatbotAction.title }}</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"chatbot-form-element-container\" *ngIf=\"currentInput != null && currentInput !== undefined\">\n\t\t\t\t<div *ngIf=\"currentInput.type == '51'\">\n\t\t\t\t\t<ion-textarea rows=\"1\" autosize [(ngModel)]=\"currentInputResult\"></ion-textarea>\n\t\t\t\t\t<button ion-button full col-3 color=\"default\" class=\"btn-send\" (click)=\"postInputData();\"><ion-icon name=\"send\"></ion-icon></button>\n\t\t\t\t</div>\n\t\t\t\t<div *ngIf=\"currentInput.type == '53'\">\n\t\t\t\t\t<ion-label>{{ currentInputResult }}</ion-label>\n\t\t\t\t\t<ion-range col-9 min=\"{{ currentInput.min }}\" max=\"{{ currentInput.max }}\" step=\"{{ currentInput.step }}\" snaps=\"true\" color=\"secondary\" [(ngModel)]=\"currentInputResult\"></ion-range>\n\t\t\t\t\t<button col-3 (click)=\"postInputData();\">Send</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</ion-content>\n";
var CHATBOT_CSS = "\n.clearfix::after {\ncontent: \"\";\nclear: both;\ndisplay: table;\n}\n.chatbot-container{\ndisplay: flex;\nflex-direction: column;\nheight: 100%;\n}\nion-content{\nbackground-color: #f3f3f3;\n}\n.chatbot-direct-chat-messages {\noverflow: auto;\npadding: 10px;\nflex-grow: 1;\n}\n.chatbot-footer{\nwidth: 100%;\n}\n.bubble-container{\ndisplay: block;\npadding: 0;\n}\n.white-bubble, .blue-bubble {\nbackground-color: #fff;\nfont-size: 15px;\nborder-top-left-radius: 0em;\nborder-top-right-radius: 0.5em;\nborder-bottom-left-radius: 0.5em;\nborder-bottom-right-radius: 0.5em;\nbox-shadow: 0 0.4px 0.2px rgba(0,0,0,0.35);\n-webkit-box-shadow: 0 0.4px 0.2px rgba(0,0,0,0.35);\nwidth: auto;\ndisplay: inline-block;\nfloat: left;\npadding-left: 0px;\nmargin: 0px 0px 4px 0px;\n}\n.blue-bubble {\nbackground-color: #0084ff;\nborder-top-left-radius: 0.5em;\nborder-top-right-radius: 0em;\nfloat: right;\ncolor: #fff;\nmargin: 0px 0px 5px 0px;\n}\n.bubble-content {\npadding: 10px;\ndisplay: flex;\nflex-grow: 1;\n}\n.blue-bubble ul{\nmargin: 0; padding: 0;list-style: none;\n}\n.mini_label{\nfont-size: 12px;margin-bottom: 3px;\n}\n.btn-inapp {\nmargin: 0 !important;\ncolor: #656565;\n}\n.form-content {\npadding: 10px;\ndisplay: flex;\nflex-grow: 1;\n}\n.form-content ion-label {\ncolor: #000 !important;\nfont-size: 16px !important;\n}\n.nonfix {\ntext-align: center;\nmargin: 0 auto;\n}\n.chatbot-action-container{\ntext-align: center;\npadding: 0 10px;\nposition:relative;\n}\n.__exit-buttonsInline {\nlist-style-type: none;\npadding-left: 0px;\nmargin: 10px 0;\n}\n.__exit-buttonsInline li {\ndisplay: inline-flex;\nmargin: 0 3px 3px;\n}\n.__exit-buttonsInline li a {\ntext-decoration: none;\nbackground-color: #ff4d72;\ncolor: #fff;\npadding: 8px 15px;\nfont-size: 15px;\nfont-weight: bold;\ndisplay: block;\nwidth: auto;\nborder-top-left-radius: 0.2em;\nborder-top-right-radius: 1.3em;\nborder-bottom-left-radius: 1.3em;\nborder-bottom-right-radius: 1.3em;\nbox-shadow: 0 0.4px 0.2px rgba(0,0,0,0.25);\n}\ndiv#wave {\nposition: relative;\nmargin-top: 0vh;\ntext-align: center;\nwidth: 50px;\n/* height: 50px; */\nmargin-left: auto;\nmargin-right: auto;\n}\ndiv#wave .dot {\ndisplay: inline-block;\nwidth: 5px;\nheight: 5px;\nborder-radius: 50%;\nmargin-right: 3px;\nbackground: #303131;\nanimation: wave 1.3s linear infinite;\n}\ndiv#wave .dot:nth-child(2) {\nanimation-delay: -1.1s;\n}\ndiv#wave .dot:nth-child(3) {\n  animation-delay: -0.9s;\n}\n@keyframes wave {\n\t0%, 60%, 100% {\n\t\ttransform: initial;\n\t}\n\t30% {\n\t\ttransform: translateY(-10px);\n\t}\n}\n";
var BRIQUEChatbot = /** @class */ (function () {
    function BRIQUEChatbot(navCtrl, navParams, chatProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.chatProvider = chatProvider;
        this.currentBlockMessages = [];
        this.chatMessages = [];
        this.chatbotActions = [];
        this.showWave = true;
        this.currentInput = null;
        this.currentInputResult = null;
        //
        this.exitMessage = {};
        this.currentBlockMessageIndex = 0;
        this.subjects = [];
        this.currentSelection = 1;
        this.chatbotImage = "";
        this.customerCode = this.navParams.get("customerCode");
        this.botCode = this.navParams.get("botCode");
        this.apiEndpoint = this.navParams.get("apiEndpoint");
        if (this.customerCode == null || this.customerCode === undefined || this.customerCode.trim().length == 0 ||
            this.botCode == null || this.botCode === undefined || this.botCode.trim().length == 0 ||
            this.apiEndpoint == null || this.apiEndpoint === undefined || this.apiEndpoint.trim().length == 0)
            throw new Error("Improper Chatbot registration. Please provide the customer code, bot code and the endpoint URL.");
        this.registerChatbot();
    }
    // Call to register the chatbot
    // Call to register the chatbot
    BRIQUEChatbot.prototype.registerChatbot = 
    // Call to register the chatbot
    function () {
        console.log("Call to register the chatbot");
        this.initiateChat();
    };
    // Reset the blocks
    // Reset the blocks
    BRIQUEChatbot.prototype.resetBlocks = 
    // Reset the blocks
    function () {
        this.currentBlock = null;
        this.currentInput = null;
        this.exitMessage = {};
        this.currentBlockMessageIndex = 0;
        this.chatbotActions = [];
    };
    // Call to initiate the chat
    // Call to initiate the chat
    BRIQUEChatbot.prototype.initiateChat = 
    // Call to initiate the chat
    function () {
        var _this = this;
        // console.log("Call to initiate the chat");
        this.chatProvider.initiateChat(this.customerCode, this.botCode, this.apiEndpoint).then(function (data) {
            // console.log("Got the data from the server.");
            console.log(data);
            _this.resetBlocks();
            if (data.hasOwnProperty("chatbot") && data["chatbot"] != null && data["chatbot"] !== undefined) {
                var chatbot = data["chatbot"];
                _this.chatbotName = chatbot["bot_name"];
            }
            if (data.hasOwnProperty("greeting") && data["greeting"] != null && data["greeting"] !== undefined) {
                var greeting = data["greeting"];
                if (greeting.hasOwnProperty("block") && greeting["block"] != null && greeting["block"] !== undefined) {
                    _this.extractResponse(greeting);
                }
                // PENDING: need to take a good look at this
                if (greeting.hasOwnProperty("subjects") && greeting["subjects"] != null && greeting["subjects"] !== undefined) {
                    _this.subjects = greeting["subjects"];
                }
            }
        });
    };
    // Extract the response
    // Extract the response
    BRIQUEChatbot.prototype.extractResponse = 
    // Extract the response
    function (_data) {
        this.currentBlock = new MdlChatBlock(_data["block"]);
        this.currentInput = null;
        this.currentBlockMessages = this.currentBlock.messages;
        this.currentBlockMessageIndex = 0;
        this.currentSelection = _data["status"];
        this.processNextMessage();
    };
    // Processes the chat block, push all the chat messages
    // Processes the chat block, push all the chat messages
    BRIQUEChatbot.prototype.processNextMessage = 
    // Processes the chat block, push all the chat messages
    function () {
        var _this = this;
        if (this.currentBlockMessages != null && this.currentBlockMessages.length > 0) {
            if (this.currentBlockMessageIndex >= this.currentBlockMessages.length) {
                // Time to show the subjects and return
                console.log("currentSelection :: " + this.currentSelection);
                if (this.currentSelection == 1) {
                    if (this.chatbotActions != null && this.chatbotActions.length > 0) {
                        // showExitMessage();
                        console.log("ShowExitMessage");
                    }
                }
                else if (this.currentSelection == 2) {
                    this.showWave = true;
                    this.showSubjects();
                }
                else {
                    // This may mean that the conversation may have ended
                    // this.showEndConversation();
                }
                return;
            }
            this.showWave = true;
            // Lets add the message
            console.log("Looking up message number " + this.currentBlockMessageIndex);
            var blockMessage_1 = this.currentBlockMessages[this.currentBlockMessageIndex];
            blockMessage_1.sender = 1;
            blockMessage_1.message_id = Date.now();
            console.log(blockMessage_1);
            setTimeout(function () {
                _this.chatMessages.push(blockMessage_1);
                _this.showWave = false;
                _this.currentBlockMessageIndex++;
                if (!blockMessage_1.hasOwnProperty("form"))
                    _this.processNextMessage();
                else {
                    if (blockMessage_1["type"] == "3") {
                        if (blockMessage_1["subtype"] == "51") {
                            _this.currentInput = blockMessage_1["form"][0];
                        }
                        else if (blockMessage_1["subtype"] == "52") {
                            var choice = blockMessage_1["form"][0];
                            var _options = choice.options.split(":");
                            for (var _i = 0, _options_1 = _options; _i < _options_1.length; _i++) {
                                var _option = _options_1[_i];
                                var route = { block_route_id: 0, type: choice.type, title: _option, response_label: choice.id };
                                _this.chatbotActions.push(route);
                            }
                        }
                        else if (blockMessage_1["subtype"] == "53") {
                            _this.currentInput = blockMessage_1["form"][0];
                        }
                    }
                }
                _this.scrollPageToBottom();
            }, blockMessage_1.showafter);
        }
        else {
            // Time to show exit message or subjects
            this.scrollPageToBottom();
        }
    };
    // Show the subjects
    // Show the subjects
    BRIQUEChatbot.prototype.showSubjects = 
    // Show the subjects
    function () {
        var _this = this;
        // console.log("showSubjects");
        var message = { type: "-1", title: "What goals are you planning for?" };
        setTimeout(function () {
            _this.showWave = false;
            _this.chatMessages.push(message);
            // Show the actions
            for (var _i = 0, _a = _this.subjects; _i < _a.length; _i++) {
                var subject = _a[_i];
                var route = { block_route_id: subject.subject_id, type: '101', title: subject.subject_title };
                _this.chatbotActions.push(route);
            }
            _this.scrollPageToBottom();
        }, 500);
    };
    BRIQUEChatbot.prototype.optionClick = function (chatbotAction) {
        // console.log("Route clicked");
        if (chatbotAction.type == '101') {
            // Subject was selected
            this.postSubjectSelection(chatbotAction);
        }
        else if (chatbotAction.type == '102') {
        }
        else if (chatbotAction.type == '52') {
            // route was selected
            // console.log("some sort of a route clicked");
            // console.log(chatbotAction);
            this.postFormResponse(chatbotAction.title, chatbotAction.response_label);
        }
    };
    BRIQUEChatbot.prototype.postSubjectSelection = function (chatbotAction) {
        var _this = this;
        this.resetBlocks();
        this.showMyResponse(chatbotAction.title, null);
        console.log("Sending this data ");
        // console.log(chatbotAction);
        this.chatProvider.postSubjectSelection(this.customerCode, this.botCode, this.apiEndpoint, chatbotAction.block_route_id).then(function (data) {
            console.log("Subject response data");
            console.log(data);
            _this.extractResponse(data);
        });
    };
    BRIQUEChatbot.prototype.postFormResponse = function (value, key) {
        this.chatbotActions = [];
        console.log("posting form choice");
        this.showMyResponse(value, key);
        this.processNextMessage();
    };
    BRIQUEChatbot.prototype.postInputData = function () {
        console.log("posting input data");
        console.log(this.currentInputResult);
        this.postFormResponse(this.currentInputResult, this.currentInput.id);
        this.currentInput = null;
    };
    // --------------------------
    // --------------------------
    BRIQUEChatbot.prototype.showMyResponse = 
    // --------------------------
    function (myResponse, responseLabel) {
        this.chatMessages.push({ title: myResponse, label: responseLabel, type: 1, sender: 2 });
        this.scrollPageToBottom();
    };
    BRIQUEChatbot.prototype.scrollPageToBottom = function () {
        var _this = this;
        setTimeout(function () {
            _this.contentArea.scrollToBottom();
        }, 50);
    };
    BRIQUEChatbot.decorators = [
        { type: Component, args: [{
                    // selector: 'brique-chatbot',
                    template: HTML_TEMPLATE,
                    styles: [CHATBOT_CSS],
                    providers: [BRIQUEChatProvider]
                },] },
    ];
    /** @nocollapse */
    BRIQUEChatbot.ctorParameters = function () { return [
        { type: NavController, },
        { type: NavParams, },
        { type: BRIQUEChatProvider, },
    ]; };
    BRIQUEChatbot.propDecorators = {
        "contentArea": [{ type: ViewChild, args: [Content,] },],
        "messagesList": [{ type: ViewChild, args: ['list',] },],
    };
    return BRIQUEChatbot;
}());
export { BRIQUEChatbot };
//# sourceMappingURL=brique-chatbot.js.map