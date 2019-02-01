import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BRIQUEChatProvider {

    constructor( public http: Http){
        console.log("call default service provider");
    }
	public static getRequestOptions(): RequestOptions{
		let headers = new Headers({ 'Content-Type': 'application/json' });
		// if(localStorage.getItem("bot_session_id")!==null){
		// 	let sessionBotId = localStorage.getItem('bot_session_id');
		// 	if(sessionBotId.length > 0){
		// 		headers.append('bot_session_id', sessionBotId);
		// 		console.log(sessionBotId);
		// 	}
		// }
		// headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
	    return options;
  	}
	// ---------------------------------
    // Initiate the chatbot call
	public initiateChatbot(_customerCode:string, _botCode:string, _runMode:number, _url:string){
        // Let us prepare the HTTP request
        _url = _url + "initmbot";
		let options = BRIQUEChatProvider.getRequestOptions();
        var requestParams = JSON.stringify({ customercode:_customerCode, botcode:_botCode, runmode:_runMode });
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
                .map(res => res.json())
				.subscribe(data => {
                    resolve(data);
                });
            });
    }

	public showSubjects(_customerCode:string, _botCode:string, _runMode:number, _url:string){
		_url = _url + "getmsubj";
		let options = BRIQUEChatProvider.getRequestOptions();
		var botSessionID = localStorage.getItem("bot_session_id");
        var requestParams = JSON.stringify({ customercode:_customerCode, botcode:_botCode, runmode:_runMode, bot_session_id: botSessionID });
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
                .map(res => res.json())
				.subscribe(data => {
					//check if the response has an instance of the chatbotobject
					if( data.hasOwnProperty("chatbotobject") && data["chatbotobject"]!= null && data["chatbotobject"] !== undefined ){
						localStorage.setItem("chatbotobject",  JSON.stringify(data["chatbotobject"]));
					}
                    resolve(data);
                });
            });
	}

    // ---------------------------------
	// Chatbot subject selected action
    public postSubjectSelection(_customerCode:string, _botCode:string, _runMode:number, _url:string, _selectedSubjectId: number){
        // Let us prepare the HTTP request
        _url = _url + "selmsubj";
		var botSessionID = localStorage.getItem("bot_session_id");
        var requestParams = { customercode:_customerCode, botcode:_botCode, runmode:_runMode, subject_id: _selectedSubjectId, bot_session_id: botSessionID };
        let options = BRIQUEChatProvider.getRequestOptions();
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
                .map(res => res.json())
				.subscribe(data => {
					//check if the response has an instance of the chatbotobject
					if( data.hasOwnProperty("chatbotobject") && data["chatbotobject"]!= null && data["chatbotobject"] !== undefined ){
						localStorage.setItem("chatbotobject",  JSON.stringify(data["chatbotobject"]));
					}
                    resolve(data);
                });
            });
    }

	// ---------------------------------
	// Chatbot form response
    public postFormResponse(_customerCode:string, _botCode:string, _runMode:number, _url:string, __formResponse: any, __messageId:string){
		// Let us prepare the HTTP request
        _url = _url + "postmfrmresp";
		var botSessionID = localStorage.getItem("bot_session_id");
        var requestParams = { customercode:_customerCode, botcode:_botCode, runmode:_runMode, form_response:__formResponse, message_id:__messageId, bot_session_id:botSessionID };
        let options = BRIQUEChatProvider.getRequestOptions();
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
                .map(res => res.json())
                .subscribe(data => {
					//check if the response has an instance of the chatbotobject
					if( data.hasOwnProperty("chatbotobject") && data["chatbotobject"]!= null && data["chatbotobject"] !== undefined ){
						localStorage.setItem("chatbotobject",  JSON.stringify(data["chatbotobject"]));
					}
                    resolve(data);
                });
            });
    }

	// ---------------------------------
	// Chatbot Route response
	public postRouteResponse(_customerCode:string, _botCode:string, _runMode:number, _url:string, __fromBlockId: number, __routeId:number, __routeType:number){
		// Let us prepare the HTTP request
        _url = _url + "postmresp";
		var botSessionID = localStorage.getItem("bot_session_id");
        var requestParams = { customercode:_customerCode, botcode:_botCode, runmode:_runMode, from_block_id:__fromBlockId, route_id:__routeId, route_type: __routeType, bot_session_id:botSessionID };
        let options = BRIQUEChatProvider.getRequestOptions();
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
            .map(res => res.json())
            .subscribe(data => {
				//check if the response has an instance of the chatbotobject
				if( data.hasOwnProperty("chatbotobject") && data["chatbotobject"]!= null && data["chatbotobject"] !== undefined ){
					localStorage.setItem("chatbotobject", JSON.stringify(data["chatbotobject"]));
				}
                resolve(data);
            });
        });
    }
}
