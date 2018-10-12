import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BRIQUEChatProvider {

    constructor( public http: Http){
        console.log("call default service provider");
    }

    // Initiate the chatbot call
	public initiateChat(_customerCode:string, _botCode:string, _url:string){
        // console.log("call intiateChat function");
        // Let us prepare the HTTP request
        _url = _url + "initiatebot";
        var requestParams = JSON.stringify({ customercode:_customerCode, botcode:_botCode });
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
            });
    }

    //
    public postSubjectSelection(_customerCode:string, _botCode:string, _url:string, _selectedSubjectId: number){
        // console.log("call intiateChat function");
        // Let us prepare the HTTP request
        _url = _url + "selectsubject";
        var requestParams = { customercode:_customerCode, botcode:_botCode, subject_id: _selectedSubjectId };
        // console.log("Sending this data .. ");
        // console.log(requestParams);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        return new Promise(resolve => {
            this.http.post(_url, requestParams, options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
            });
    }

    public postFormResponse(form_id: string, id: string, value: string){
        
    }
}
