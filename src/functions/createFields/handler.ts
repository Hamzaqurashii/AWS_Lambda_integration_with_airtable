import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
// import * as AWS from "aws-sdk";
import Airtable from "airtable";
import schema from "./schema";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  var base = new Airtable({ apiKey: event.body.apiKey }).base(
    event.body.baseID
  );

  base("Table 2").create(event.body.fields, function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });
  return formatJSONResponse({
    message: `Record has been created`,
    event,
  });
};

export const main = middyfy(hello);
