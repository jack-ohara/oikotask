import {
  Mfa,
  UserPool,
  UserPoolClient,
  UserPoolEmail,
} from "aws-cdk-lib/aws-cognito";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SSTConfig } from "sst";
import { NextjsSite, Table, Cognito, Function } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "oikotask-app",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const isProd = process.env.SST_STAGE === "prod";
      const prodBaseUrl = "https://d2omkrhunnhu2q.cloudfront.net";

      const cognitoUserPool = new UserPool(
        stack,
        `oikotask-${process.env.SST_STAGE}-user-pool`,
        {
          userPoolName: `OikoTask ${process.env.SST_STAGE} users`,
          selfSignUpEnabled: false,
          signInAliases: {
            email: true,
            username: false,
          },
          email: UserPoolEmail.withSES({
            sesRegion: "eu-west-1",
            fromEmail: "oikotask@johtest.link",
            fromName: "OikoTask",
            replyTo: "no-reply@johtest.link",
            sesVerifiedDomain: "johtest.link",
          }),
          enableSmsRole: true,
          mfa: Mfa.OPTIONAL,
          deletionProtection: true,
        }
      );

      cognitoUserPool.addDomain(
        `oikotask-${process.env.SST_STAGE}-cognito-domain`,
        {
          cognitoDomain: {
            domainPrefix: `oikotask-${process.env.SST_STAGE}`,
          },
        }
      );

      const cognitoUserPoolClient = new UserPoolClient(
        stack,
        `oikotask-${process.env.SST_STAGE}-user-pool-client`,
        {
          userPool: cognitoUserPool,
          userPoolClientName: "oikotask-web-app",
          authFlows: {
            custom: true,
            userSrp: true,
          },
          oAuth: {
            callbackUrls: isProd
              ? [`${prodBaseUrl}/api/auth/callback/cognito`]
              : ["http://localhost:3000/api/auth/callback/cognito"],
          },
          generateSecret: true,
        }
      );

      const cognito = new Cognito(
        stack,
        `oikotask-${process.env.SST_STAGE}-auth`,
        {
          cdk: {
            userPool: cognitoUserPool,
            userPoolClient: cognitoUserPoolClient,
          },
        }
      );

      const oikoTable = new Table(stack, `oikotask-${process.env.SST_STAGE}`, {
        primaryIndex: {
          partitionKey: "pk",
          sortKey: "sk",
        },
        fields: {
          pk: "string",
          sk: "string",
        },
      });

      const envVariables: Record<string, string> = {
        COGNITO_CLIENT_ID: cognitoUserPoolClient.userPoolClientId,
        COGNITO_CLIENT_SECRET:
          cognitoUserPoolClient.userPoolClientSecret.toString(),
        COGNITO_ISSUER: `https://cognito-idp.${stack.region}.amazonaws.com/${cognito.userPoolId}`,
        USER_POOL_ID: cognito.userPoolId,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
        DDB_TABLE_NAME: oikoTable.tableName,
        NEXT_PUBLIC_VAPID_PUBLIC_KEY:
          "BDAzA6um0UFqjpU_mbK1GxJ_SH8_D663xVb1ng5ccRD0b25SvV8tPZk9Hj2c02bwrZOG0MJqgh6arq9UIMADLCw",
        VAPID_PRIVATE_KEY_PARAM_NAME: "/oikotask/vapid-private-key",
      };

      if (isProd) {
        envVariables["NEXTAUTH_URL"] = prodBaseUrl;
      }

      const site = new NextjsSite(stack, "site", {
        bind: [oikoTable],
        environment: envVariables,
        permissions: [
          new PolicyStatement({
            actions: ["ssm:Get*"],
            resources: [
              "arn:aws:ssm:eu-west-1:534699847887:parameter/oikotask/vapid-private-key",
            ],
          }),
          new PolicyStatement({
            actions: ["scheduler:Get*", "scheduler:Create*"],
            resources: ["arn:aws:scheduler:eu-west-1:534699847887*"],
          }),
          new PolicyStatement({
            actions: ["iam:PassRole"],
            resources: [
              "arn:aws:iam::534699847887:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_092455dcfa",
            ],
          }),
        ],
      });

      const notifierFunction = new Function(stack, "pushNotificationFunction", {
        handler: "src/lambdas/send-push-notification.handler",
        functionName: `oikotask-${process.env.SST_STAGE}-send-push-notification`,
        environment: envVariables,
        permissions: [
          new PolicyStatement({
            actions: ["ssm:Get*"],
            resources: [
              "arn:aws:ssm:eu-west-1:534699847887:parameter/oikotask/vapid-private-key",
            ],
          }),
        ],
        bind: [oikoTable],
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
