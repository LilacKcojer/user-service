import { SendEmailCommand, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../clients/sesClient";


const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Text: {
            Charset: "UTF-8",
            Data: "Thank you for signing up.",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Welcome, new user",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

const EMAIL_ADDRESS = "jackcolllier@gmail.com";


exports.handler = async (event) => {

    

    const email = event.Records[0].Sns.Message;

    const sendEmailCommand = createSendEmailCommand(email, EMAIL_ADDRESS);
    let response = "";
    try{
        response = await sesClient.send(sendEmailCommand);
    }
    catch(err){
        console.log(err);
    }

    console.log(response);

}