import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import * as AWS from "aws-sdk";
import Airtable from "airtable";
import schema from "./schema";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {

  var base = new Airtable({ apiKey: event.body.apiKey }).base(
    event.body.baseID
  );

  base('Table 2').update(event.body.id, {
    "Name": event.body.Name,
    "Notes": event.body.Note
  }, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(record.get('Name'));
  });
  // let dynamo = new AWS.DynamoDB.DocumentClient({
  //   region: "eu-west-2",
  //   endpoint: "http://localhost:8000",
  // });
  // const data = await dynamo
  //   .update({
  //     TableName: "myTable",
  //     Key: { fname: event.body.fname },
  //     UpdateExpression: "set email = :a",
  //     ExpressionAttributeValues: { ":a": event.body.email },
  //   })
  //   .promise();
  // console.log(data.$response.data);

  return formatJSONResponse({
    message: "updated",
  });
};

export const main = middyfy(hello);
