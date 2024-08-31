import { PublishCommand }  from "@aws-sdk/client-sns";
import {snsClient} from "../clients/snsClient.js";


exports.handler = async (event, context, callback) => {

    const email = event.Records[0].dynamodb.NewImage.email.S;

    await snsClient.send( new PublishCommand({
        Message: email,
        TopicArn: "arn:aws:sns:us-west-2:891377311743:newUsertopic"
    }));
}