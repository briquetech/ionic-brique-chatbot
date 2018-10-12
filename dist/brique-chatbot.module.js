import { NgModule } from '@angular/core';
import { BRIQUEChatbot } from './components/brique-chatbot';
import { BRIQUEChatProvider } from './providers/chat-provider';
import { IonicModule } from 'ionic-angular';
var BRIQUEChatbotModule = /** @class */ (function () {
    function BRIQUEChatbotModule() {
    }
    BRIQUEChatbotModule.forRoot = function () {
        return {
            ngModule: BRIQUEChatbotModule,
            providers: [BRIQUEChatProvider]
        };
    };
    BRIQUEChatbotModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        IonicModule
                    ],
                    declarations: [
                        BRIQUEChatbot,
                    ],
                    exports: [
                        BRIQUEChatbot
                    ]
                },] },
    ];
    return BRIQUEChatbotModule;
}());
export { BRIQUEChatbotModule };
//# sourceMappingURL=brique-chatbot.module.js.map