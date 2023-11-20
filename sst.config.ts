import {
  Mfa,
  UserPool,
  UserPoolClient,
  UserPoolEmail,
} from "aws-cdk-lib/aws-cognito";
import { SSTConfig } from "sst";
import { NextjsSite, Table, Cognito } from "sst/constructs";

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
      const prodBaseUrl = "https://d23bon0t374v2e.cloudfront.net";

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
      };

      if (isProd) {
        envVariables["NEXTAUTH_URL"] = prodBaseUrl;
      }

      const site = new NextjsSite(stack, "site", {
        bind: [oikoTable],
        environment: envVariables,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
