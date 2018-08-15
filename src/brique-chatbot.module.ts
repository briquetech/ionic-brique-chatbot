import { NgModule, ModuleWithProviders } from '@angular/core';
// import { CMPChatMessage } from './components/chat-message';
// import { CMPChatAction } from './components/chat-action';
import { BRIQUEChatbot } from './components/brique-chatbot';
import { BRIQUEChatProvider } from './providers/chat-provider';
import { IonicModule } from 'ionic-angular';

@NgModule({
	imports: [
		// Only if you use elements like ion-content, ion-xyz...
		IonicModule
	],
	declarations: [
		// declare all components that your module uses
		BRIQUEChatbot,
		// CMPChatMessage
		// CMPChatAction
	],
	exports: [
		// export the component(s) that you want others to be able to use
		BRIQUEChatbot
	]
})
export class BRIQUEChatbotModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: BRIQUEChatbotModule,
			providers: [BRIQUEChatProvider]
		};
	}
}
