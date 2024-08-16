import {
    type ShopRepositoryInterface,
    type ShopInterface,
    SimpleShop,
} from "@friendsofshopware/app-server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


export default class DynamoDBRepository implements ShopRepositoryInterface {
    client: DynamoDBClient;
    docClient: DynamoDBDocumentClient;

    constructor(client: DynamoDBClient) {
        this.client = client;
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    createShopStruct(shopId: string, shopUrl: string, shopSecret: string): ShopInterface {
        return new SimpleShop(shopId, shopUrl, shopSecret);
    }

    async createShop(shop: ShopInterface): Promise<void> {
        const cmd = new PutCommand({
            TableName: "shop",
            Item: {
                id: shop.getShopId(),
                url: shop.getShopUrl(),
                secret: shop.getShopSecret(),
                client_id: shop.getShopSecret(),
                client_secret: shop.getShopClientSecret(),
            },
        })

        await this.docClient.send(cmd);
    }

    async getShopById(id: string): Promise<ShopInterface | null> {
        const cmd = new GetCommand({
            TableName: "shop",
            Key: {
                id: id,
            },
        });

        const response = await this.docClient.send(cmd);

        if (!response.Item) {
            return null;
        }

        const shop = new SimpleShop(
            response.Item.id,
            response.Item.url,
            response.Item.secret,
        );

        if (response.Item.client_id) {
            shop.setShopCredentials(response.Item.client_id, response.Item.client_secret);
        }

        return shop;
    }
    async updateShop(shop: ShopInterface): Promise<void> {
        return this.createShop(shop);
    }
    async deleteShop(id: string): Promise<void> {
        const cmd = new DeleteCommand({
            TableName: "shop",
            Key: {
                id: id,
            },
        });

        await this.docClient.send(cmd);
    }
}