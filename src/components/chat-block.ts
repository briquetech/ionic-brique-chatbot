export class MdlChatBlock{

    block_id: number;
    block_messages: string;
    block_title: string;
    exit_message: string;
    has_routes: number;
    messages: any[];

    constructor(_data: any[]){
        this.block_id       = _data["block_id"];
        this.block_messages = _data["block_messages"];
        this.block_title    = _data["block_title"];
        this.exit_message   = _data["exit_message"];
        this.has_routes     = _data["has_routes"];
        this.messages       = _data["messages"];
    }
}
