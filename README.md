# Shopware App Server on Lambda using DynamoDB as storage

This project uses Node.js, DynamoDB, AWS and [SST](https://ion.sst.dev/docs/) to create a serverless app that can be used as a Shopware App Server.

Install the dependencies:

```bash
npm install
```

Install SST

```
brew install sst/tap/sst
```

Deploy your app

```bash
sst deploy
```

or run it in dev mode

```bash
sst dev
```