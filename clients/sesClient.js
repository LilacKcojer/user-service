import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
const REGION = "us-west-2";
// Create SES service object.
export const sesClient = new SESClient({ region: REGION });