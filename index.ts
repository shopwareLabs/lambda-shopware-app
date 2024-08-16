import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { configureAppServer } from "@friendsofshopware/app-server/framework/hono";
import DynamoDBRepository from './repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type {
    AppServer,
    Context,
    ShopInterface,
  } from "@friendsofshopware/app-server";
import { createNotificationResponse } from '@friendsofshopware/app-server/helper/app-actions';

type Bindings = {
    APP_NAME: string
    APP_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

const client = new DynamoDBClient();

configureAppServer(app, {
    appName: process.env.APP_NAME as string,
    appSecret: process.env.APP_SECRET as string,
    shopRepository: new DynamoDBRepository(client)
});

declare module "hono" {
    interface ContextVariableMap {
      app: AppServer;
      shop: ShopInterface;
      context: Context;
    }
  }


app.post('/app/shit', async c => {
    return createNotificationResponse('success', 'hello from js');
});

export const handler = handle(app)
export default app