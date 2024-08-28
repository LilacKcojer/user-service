import { PublishCommand }  from "@aws-sdk/client-sns";
import {snsClient} from "../snsClient/snsClient.js";


exports.handler = async (event, context, callback) => {

    const email = event.Records[0].dynamodb.NewImage.email.S;

    await snsClient.send( new PublishCommand({
        Message: email,
        Topic: "arn:aws:sns:us-west-2:891377311743:newUsertopic"
    }));
}