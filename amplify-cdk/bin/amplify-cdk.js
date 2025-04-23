#!/usr/bin/env node

// Import the core CDK library
const cdk = require("aws-cdk-lib");

// Import your stack definition from the lib folder
//🔄 Update here: Make sure this path matches your actual stack file
const { AmplifyCdkStack } = require("../lib/amplify-cdk-stack");

// Initialize a new CDK app context
const app = new cdk.App();

// Pull in context values passed via CLI (-c key=value)
const githubToken = app.node.tryGetContext("githubToken"); // 🔄 Required: GitHub PAT for Amplify access
const githubOwner = app.node.tryGetContext("githubOwner") || "ASUCICREPO"; // 🔄 Default repo owner fallback
const viteApiUrl = app.node.tryGetContext("viteApiUrl"); // 🔄 Optional: VITE_API_URL environment var for frontend

//  Guard clause: Ensure GitHub token is provided
if (!githubToken) {
  throw new Error("GitHub token must be provided. Use -c githubToken=<your-token> when deploying.");
}

//  Instantiate your Amplify app stack
new AmplifyCdkStack(app, "CdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT, // Automatically pulled from AWS profile
    region: process.env.CDK_DEFAULT_REGION, // Set in your profile or CLI config
  },
  githubToken, //  Injected GitHub token (from context)
  githubOwner, //  GitHub user/org name
  apiUrl: viteApiUrl, //  Passed to Amplify as VITE_API_URL env var
});
