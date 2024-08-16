/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "shopware-app-lambda",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("shop", {
      fields: {
        id: "string"
      },
      primaryIndex: { hashKey: "id" }
    });

    const hono = new sst.aws.Function("Hono", {
      url: true,
      handler: "index.handler",
      link: [table],
      environment: {
        APP_NAME: 'TestApp',
        APP_SECRET: 'MyAppSecret'
      }
    });

    const router = new sst.aws.Router("MyRouter", {
      routes: {
        "/*": hono.url
      }
    });

    return {
      api: hono.url,
      router: router.url,
    };
  },
});
