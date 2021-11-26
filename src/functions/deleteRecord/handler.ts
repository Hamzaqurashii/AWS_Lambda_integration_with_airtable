import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import * as AWS from "aws-sdk";
import schema from "./schema";
import Airtable from "airtable";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  var base = new Airtable({ apiKey: event.body.apiKey }).base(
    event.body.baseID
  );

  base("Table 2").destroy(
    event.body.fields,
    function (err, deletedRecords) {
      if (err) {
        console.error(err);
        return;
      }
      console.log({Name:event.body.fields}, deletedRecords.length, "records");
    }
  );
  // let dynamo = new AWS.DynamoDB.DocumentClient({
  //   region: "eu-west-2",
  //   endpoint: "http://localhost:8000",
  // });
  // const data = await dynamo
  //   .delete({ TableName: "myTable", Key: { fname: event.body.fname } })
  //   .promise();
  return formatJSONResponse({
    message: "deleted",
  });
};

export const main = middyfy(hello);
