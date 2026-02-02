// Main Bicep template for Lejio Fri on Azure
// Deploys: Static Web App, SQL Database, Key Vault, Functions, Storage

param environment string = 'dev'
param location string = resourceGroup().location
param projectName string = 'lejio-fri'

// Database parameters
param sqlAdminUsername string
@secure()
param sqlAdminPassword string

// Static Web App GitHub integration
param githubRepo string = 'martinjensen9988-sudo/lejio-b75cff1f'
param githubBranch string = 'main'

// Naming
var resourceSuffix = '${projectName}-${environment}'
var sqlServerName = 'sql-${uniqueString(resourceGroup().id)}-${environment}'
var keyVaultName = 'kv-${uniqueString(resourceGroup().id)}-${environment}'
var storageAccountName = 'st${replace(projectName, '-', '')}${environment}'
var functionAppName = 'func-${resourceSuffix}'
var staticWebAppName = 'swa-${resourceSuffix}'

// Deploy modules
module sqlDatabase 'modules/sql.bicep' = {
  name: 'sqlDatabase'
  params: {
    location: location
    sqlServerName: sqlServerName
    adminUsername: sqlAdminUsername
    adminPassword: sqlAdminPassword
    projectName: projectName
  }
}

module keyVault 'modules/keyvault.bicep' = {
  name: 'keyVault'
  params: {
    location: location
    keyVaultName: keyVaultName
    sqlConnectionString: sqlDatabase.outputs.connectionString
    storageAccountKey: storage.outputs.storageKey
  }
}

module storage 'modules/storage.bicep' = {
  name: 'storage'
  params: {
    location: location
    storageAccountName: storageAccountName
  }
}

module functions 'modules/functions.bicep' = {
  name: 'functions'
  params: {
    location: location
    functionAppName: functionAppName
    keyVaultName: keyVault.outputs.keyVaultName
    sqlConnectionString: sqlDatabase.outputs.connectionString
    storageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=${storage.outputs.storageAccountName};AccountKey=${listKeys(storage.outputs.storageAccountId, '2023-01-01').keys[0].value};EndpointSuffix=core.windows.net'
  }
}

module staticWebApp 'modules/staticwebapp.bicep' = {
  name: 'staticWebApp'
  params: {
    location: location
    staticWebAppName: staticWebAppName
    githubRepo: githubRepo
    githubBranch: githubBranch
    functionAppUrl: functions.outputs.functionAppUrl
  }
}

// Outputs
output sqlServerName string = sqlDatabase.outputs.serverName
output keyVaultUrl string = keyVault.outputs.keyVaultUrl
output staticWebAppUrl string = staticWebApp.outputs.defaultHostname
output functionAppUrl string = functions.outputs.functionAppUrl
output storageAccountName string = storage.outputs.storageAccountName
