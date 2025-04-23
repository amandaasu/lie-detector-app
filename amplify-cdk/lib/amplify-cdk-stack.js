// Import core AWS CDK modules
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");

// Import the Amplify alpha module (must be installed separately)
// Run: npm install @aws-cdk/aws-amplify-alpha@<version>
const amplify = require("@aws-cdk/aws-amplify-alpha");

// Import Secrets Manager for secure GitHub token storage
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");

// Import CodeBuild module for defining custom build steps
const codebuild = require("aws-cdk-lib/aws-codebuild");

// Define your custom CDK Stack for deploying an Amplify app
class AmplifyCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // These are values passed from bin/amplify-cdk.js
    const { githubToken, githubOwner, apiUrl } = props;

    // 1. Store GitHub Personal Access Token securely in AWS Secrets Manager
    // 🔄 Update here: Set your own secret name if needed
    const githubTokenSecret = new secretsmanager.Secret(this, "GitHubToken", {
      secretName: "lie-detector-access-token-cdk",
      description: "GitHub Personal Access Token for Amplify",
      secretStringValue: cdk.SecretValue.unsafePlainText(githubToken),
    });

    // 2. Create an Amplify App and connect it to your GitHub repo
    const amplifyApp = new amplify.App(this, "AppNamePortal", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: githubOwner, // 🔄 GitHub username or org
        repository: "lie-detector-app", // 🔄 Your repo name on GitHub
        oauthToken: githubTokenSecret.secretValue,
      }),

      // Optional: Automatically create Amplify branches for any GitHub branch
      autoBranchCreation: {
        patterns: ["*"], // e.g., all branches
        basicAuth: amplify.BasicAuth.fromGeneratedPassword("auto-user"), // adds basic auth
        pullRequestEnvironmentName: "staging", // PR branches get labeled "staging"
      },

      // 🛠 3. Build settings using CodeBuild YAML object
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: "1.0",
        frontend: {
          phases: {
            preBuild: {
              // 🔄 Navigate into the frontend folder and install deps
              commands: ["cd frontend", "npm ci"],
            },
            build: {
              // 🔄 Run the build command (customize if you use vite or next)
              commands: ["npm run build"],
            },
          },
          artifacts: {
            baseDirectory: "frontend/dist", // 🔄 Change if your output folder is different
            files: ["**/*"],
          },
          cache: {
            paths: ["frontend/node_modules/**/*"], // Speeds up future builds
          },
        },
      }),
    });

    // 4. Deploy the main branch of the repo (creates Amplify backend + frontend env)
    amplifyApp.addBranch("main");

    // 5. Add environment variables to the Amplify app (used in frontend via Vite)
    amplifyApp.addEnvironment("VITE_API_URL", apiUrl); // 🔄 Used in your React app as import.meta.env.VITE_API_URL
  }
}

// Export your stack so CDK can use it from bin/amplify-cdk.js
module.exports = { AmplifyCdkStack };
