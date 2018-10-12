# BRIQUE Chatbot IONIC2+/Angular2+ interface
This is template for plugging in the BRIQUE Chatbot into your mobile application. 

For more details on what BRIQUE Chatbot is, check the following link:

https://brique.in/products/brique-chatbot/

## How to integrate

Within your app, install this package by firing this command at the root folder of your app within command prompt

npm install ionic-brique-chatbot

## How to plugin BRIQUE Chatbot in your Ionic 2 app

This is your app.module.ts.

```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// Import your module
import { BRIQUEChatbotModule, BRIQUEChatbot } from 'ionic-brique-chatbot';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BRIQUEChatbotModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    BRIQUEChatbot
  ],
  providers: []
})
export class AppModule {}
```
