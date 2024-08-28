import { PublishCommand }  from "@aws-sdk/client-sns";
import {snsClient} from "../snsClient/snsClient.js";


exports.handler = async (event, context, callback) => {

    const email = event.Records[0].dynamodb.NewImage.email.S;

    //await snsClient.send(PublishCommand({
    //    Message: email,
    //    Topic
    //}))




}