# UMBRELLIUM Chatbot IONIC2+/Angular2+ interface
This is template for plugging in the UMBRELLIUM Chatbot into your mobile application. 

For more details on what UMBRELLIUM Chatbot is, check the following link:

https://umbrellium.com/

## How to integrate

Within your app, install this package by firing this command at the root folder of your app within command prompt

npm install ionic-brique-chatbot

## How to plugin BRIQUE Chatbot in your Ionic 2 app

This is your app.module.ts.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// import from modules
import { BRIQUEChatbot, BRIQUEChatbotModule } from 'ionic-brique-chatbot';

@NgModule({
	declarations: [
		MyApp,
		HomePage
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		BRIQUEChatbotModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		BRIQUEChatbot
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {}
```

#### Now if you want to invoke the chatbot by clicking a button, use the following code in your ts file. 
```typescript
this.navCtrl.push(BRIQUEChatbot, {
  'customerCode': '<<Your customer code>>',
  'botCode': '<<your bot code>>',
  'runMode': <<1 for testing, 0 for production>>,
  'mode': 'mobile',
  'apiEndpoint': 'https://api.umbrellium.com',
});
```
