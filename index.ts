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

export const handler = handle(app)
