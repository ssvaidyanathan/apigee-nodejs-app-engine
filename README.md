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
- Setup IAP Access
	- Create a service account with *IAP-secured Web App User*
	- Download the service account JSON _(which will be used later)_
- Turn on Cloud IAP
- For more info and details, visit [this](https://cloud.google.com/iap/docs/app-engine-quickstart#enabling_iap) doc