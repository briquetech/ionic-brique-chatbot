import { NgModule, ModuleWithProviders } from '@angular/core';
import { MessageBubbleComponent } from './components/message-bubble';
// import { AcademyProvider } from './providers/academy-provider';
import { IonicModule } from 'ionic-angular';
 
@NgModule({
	imports: [
		// Only if you use elements like ion-content, ion-xyz...
		IonicModule
	],
	declarations: [
		// declare all components that your module uses
		MessageBubbleComponent
	],
	exports: [
		// export the component(s) that you want others to be able to use
		BRIQUEChatbotComponent
	]
})
export class BRIQUEChatbotModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: BRIQUEChatbotModule
			//providers: [AcademyProvider]
		};
	}
}