# apigee-nodejs-app-engine
This repo shows an example to deploy a node app to GCP App Engine (standard), setup IAP and use Apigee Shared flow to protect the App Engine

## Pre-Requisites
- [Apigee](https://apigee.com/edge) account
- [GCP Project](https://console.cloud.google.com) with Billing enabled

## Installations
- NodeJS (10.x or later)
- [Cloud SDK ](https://cloud.google.com/sdk/)

## Setup

- Clone the repo `git clone https://github.com/ssvaidyanathan/apigee-nodejs-app-engine.git`

### Deploy App

- Open a new terminal session
- Navigate to the `apigee-nodejs-app-engine/app` directory
- Execute `npm install` to install the Node dependencies
- Execute `node app.js` to run the app in your local machine. Open `http://localhost:8080/` in your browser, you should see _"Hello from Apigee !!! "_
- Once the above step works, we can push this to GCP App Engine. Execute `gcloud auth login` and follow the instructions to login 
	- You can use `gcloud init` or `gcloud config set` to configure your login and GCP project along with the region
- Once you are logged in to gcloud in your terminal, execute `gcloud app deploy` to deploy. This may take few minutes
- Once complete, you should be able to see the service under App Engine --> Services in the GCP console. 
	NOTE: Make sure you are on the right GCP Project
- By clicking the link in the console, it should open a new browser tab that shows _"Hello from Apigee !!! "_

### Configure IAP

- In the GCP console, go to Security --> Identity-Aware Proxy and follow the steps to setup 
- Configure the OAuth consent screen and provide the necessary information
- Configure an OAuth Client ID _(will be used later)_
- Setup IAP Access
	- Create a service account with *IAP-secured Web App User*
	- Download the service account JSON _(will be used later)_
- Turn on Cloud IAP
- For more info and details, visit [this](https://cloud.google.com/iap/docs/app-engine-quickstart#enabling_iap) doc

- Now try logging into the App Engine URL in an Incognito mode (using a different user account), you should see an error page. Try the same using your account (Project Owner or any user who has IAP-secured Web App User role), you should see the _"Hello from Apigee !!! "_ message.


### Configure Key Value Map in Apigee

- Login to [Apigee](https://apigee.com/edge) to your appropriate Apigee org
- Navigate to Admin --> Environments --> Key Value Maps
- Select an environment
- Click the "+ Key Value Map" button
- Provide the name as "iam-aware" and check the "Encrypted" checkbox
- Click the created Map and click the "+" button to add the following entries from your downloaded service account JSON file and Client ID from GCP

| Key                    | Value                                        |
|------------------------|----------------------------------------------|
| client_email           | client_email from the service account json   |
| private_key            | private_key from the service account json    |
| private_key_id         | private_key_id from the service account json |
| google_oauth_client_id | OAuth Client Id configured                   |

### Deploy Apigee sharedflow

- Login to [Apigee](https://apigee.com/edge) to your appropriate Apigee org
- Navigate to Develop --> Shared Flows
- Click + Shared Flows and select "Upload bundle"
- In your cloned repo (in your local machine), browse to `apigee-bundles` and select *iap-aware_sf.zip*
- Provide `iap-aware` as the name, click "Create"
- Deploy the sharedflow (to the environment where the Key Value Map was created)

### Deploy Apigee Proxy

- Login to [Apigee](https://apigee.com/edge) to your appropriate Apigee org
- Navigate to Develop --> API Proxies
- Click + Proxy and select "Proxy bundle", click "Next"
- In your cloned repo (in your local machine), browse to `apigee-bundles` and select *iap-aware_proxy.zip*
- Give a name, click "Next" and complete the proxy wizard
- In the Develop tab, on the left menu, click "Target Endpoints". Replace the `<URL>https://{app-engine-url}</URL>` with your App Engine URL
- Deploy the proxy (to the same environment were the Key Value Map was created)

- Enable trace and make a call to "https://{org}-{env}.apigee.net/iap-aware", it should return _"Hello from Apigee !!! "_ message. In the trace, you will see that it invokes the Sharedflow which in turn generates an OAuth token (using the service account) which is authorized by IAP. 

- Try removing the access in IAP for the service account and hit the URL. Should throw an error.

NOTE: In the `AM-Set-AccessToken`, you can set any flow variables as custom header with "X-Var-" as prefix. The NodeJS example will pick those and set them as response headers

For example, run the following curl command `curl -i https://{org}-{env}.apigee.net/iap-aware`, it should show ```x-var-foo: bar, x-var-abc: xyz``` which are set in the policy

