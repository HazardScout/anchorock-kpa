const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const { createTransport } = require('nodemailer')

// Create client outside of handler to reuse
const lambda = new AWS.Lambda()

// Handler
exports.handler = async function(event, context) {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## CONTEXT: ' + serialize(context))
  console.log('## EVENT: ' + serialize(event))

  const transport = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
  })

  let emailBody = ""
  const eventPayload = event.responsePayload
  if (eventPayload.statusCode == 200) {
    const workerStatus = eventPayload.body
    emailBody = "Hai, \n\nIntegraton was success, this is the detail:\n";

    emailBody += ` Worker Name: ${workerStatus.workerName}\n`

    if (eventPayload.error && eventPayload.error !== '') {
      emailBody += ` Error: ${workerStatus.error}\n`
    }

    emailBody += ` Start: ${new Date(workerStatus.started).toLocaleString()}\n`
    emailBody += ` End: ${new Date(workerStatus.stopped).toLocaleString()}\n\n`

    const jobLogs = workerStatus.jobLog;
    for (const jobLog of jobLogs) {
      emailBody += `  Job Name: ${jobLog.jobName}\n`

      if (eventPayload.error && eventPayload.error !== '') {
        emailBody += ` Error: ${jobLog.error}\n`
      }

      emailBody += `  Start: ${new Date(jobLog.started).toLocaleString()}\n`
      emailBody += `  End: ${new Date(jobLog.stopped).toLocaleString()}\n\n`
    }

    emailBody += `Thank You\n`
  } else {
    emailBody = "Hai, Integration was failed, please check the logs"
  }

  const mailOptions = {
    from: 'no-reply@anchorock.com',
    to: process.env.REPORT_RECEIVER,
    subject: `[Report ${eventPayload.source}]`,
    text: emailBody
  }

  const info = await transport.sendMail(mailOptions)
  console.log('Email sent: ' + info)
  
  const responseBody = {
    'message':'Success Execute Data',
    'error':false
  }

  const response = {
    "statusCode": 200,
    "body": responseBody,
  }
  
  return response
}

var serialize = function(object) {
  return JSON.stringify(object, null, 2)
}
