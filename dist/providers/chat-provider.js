import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
var BRIQUEChatProvider = /** @class */ (function () {
    function BRIQUEChatProvider(http) {
        this.http = http;
        console.log("call default service provider");
    }
    // Initiate the chatbot call
    // Initiate the chatbot call
    BRIQUEChatProvider.prototype.initiateChat = 
    // Initiate the chatbot call
    function (_customerCode, _botCode, _url) {
        var _this = this;
        // console.log("call intiateChat function");
        // Let us prepare the HTTP request
        _url = _url + "initiatebot";
        var requestParams = JSON.stringify({ customercode: _customerCode, botcode: _botCode });
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        return new Promise(function (resolve) {
            _this.http.post(_url, requestParams, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            });
        });
    };
    //
    //
    BRIQUEChatProvider.prototype.postSubjectSelection = 
    //
    function (_customerCode, _botCode, _url, _selectedSubjectId) {
        var _this = this;
        // console.log("call intiateChat function");
        // Let us prepare the HTTP request
        _url = _url + "selectsubject";
        var requestParams = { customercode: _customerCode, botcode: _botCode, subject_id: _selectedSubjectId };
        // console.log("Sending this data .. ");
        // console.log(requestParams);
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        return new Promise(function (resolve) {
            _this.http.post(_url, requestParams, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            });
        });
    };
    BRIQUEChatProvider.prototype.postFormResponse = function (form_id, id, value) {
    };
    BRIQUEChatProvider.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BRIQUEChatProvider.ctorParameters = function () { return [
        { type: Http, },
    ]; };
    return BRIQUEChatProvider;
}());
export { BRIQUEChatProvider };
//# sourceMappingURL=chat-provider.js.map