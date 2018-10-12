import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
export declare class BRIQUEChatProvider {
    http: Http;
    constructor(http: Http);
    initiateChat(_customerCode: string, _botCode: string, _url: string): Promise<{}>;
    postSubjectSelection(_customerCode: string, _botCode: string, _url: string, _selectedSubjectId: number): Promise<{}>;
    postFormResponse(form_id: string, id: string, value: string): void;
}
