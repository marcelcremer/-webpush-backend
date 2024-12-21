import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as webPush from 'web-push';

// Replace with your VAPID keys
const vapidKeys = {
  publicKey:
    'BPcl5D9STLyvrM6aK_9_t8ucZcWdmIVKbzuvcvilyoMwoqE47FJq0Q86hxT6I1IlyhmBfI6B5xFQaLYOAPv8Q20',
  privateKey: '_DtVFxoD7GYUdHzF8UzLLEBIPp3Ouk-QQIRf0Gx2Dzo',
};

webPush.setVapidDetails(
  'mailto:please-dont@mail.me',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

@Controller()
export class AppController {
  _subscriptions = [];

  get subscriptions() {
    return this._subscriptions;
  }
  set subscriptions(subscriptions) {
    this._subscriptions = subscriptions;
    console.log('subscriptions:', subscriptions);
  }

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/push')
  async sendNotification(@Res() res): Promise<string> {
    for (const subscription of this.subscriptions) {
      await webPush.sendNotification(
        subscription,
        JSON.stringify({ title: 'Hello World', body: 'You are awesome!' }),
      );
    }

    return res.status(200).json({ success: true });
  }

  @Post('/subscribe')
  subscribe(@Req() req: any, @Res() res: any) {
    const subscription = req.body;
    this.subscriptions = [...this.subscriptions, subscription];
    res.status(201).json({});
  }
}
