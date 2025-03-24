const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const fs = require("fs");

const environment = process.argv[2] || "dev";
const aws_profile = process.argv[3] || "cascarita";
console.log(`Creating .env file for environment: ${environment}`);
const secretName = `${environment}/env/client`;
const region = "us-west-1";
const envFilePath = ".env";
const profile = aws_profile;

const client = new SecretsManagerClient({
  region,
  credentials: fromIni({ profile }),
});

async function createEnvFile() {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );

    const secretString = response.SecretString;

    if (!secretString) {
      throw new Error("SecretString is Empty");
    }

    const secretObject = JSON.parse(secretString);

    const envFileContent = Object.entries(secretObject)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    fs.writeFileSync(envFilePath, envFileContent);

    console.log(
      `.env file created at ${envFilePath} with secrets from AWS Secrets Manager.`
    );
  } catch (error) {
    console.error("Error fetching secret:", error);
    throw error;
  }
}

createEnvFile().catch((err) => {
  console.error("Failed to create .env file:", err);
});
