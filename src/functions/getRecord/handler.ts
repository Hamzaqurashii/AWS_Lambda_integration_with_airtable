import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
// import * as AWS from "aws-sdk";
import schema from "./schema";
import Airtable from "airtable";
import { resolve } from "path";
import { rejects } from "assert";

// let data = null;

function sendResponse(data: any) {
  console.log(data);
  return formatJSONResponse({
    message: data,
  });
}

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  var base = new Airtable({ apiKey: event.body.apiKey }).base(
    event.body.baseID
  );

  const data = await new Promise((resolve, rejects) => {
    base("Table 2").find(event.body.id, async function (err, record) {
      if (err) {
        console.error(err);
        return;
      }
      return resolve(record._rawJson);
    });
  });
  return formatJSONResponse({
    message: data,
  });
};


export const main = middyfy(hello);






