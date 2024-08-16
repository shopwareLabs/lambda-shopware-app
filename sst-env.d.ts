/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "Hono": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "MyRouter": {
      "type": "sst.aws.Router"
      "url": string
    }
    "shop": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
  }
}
export {}
