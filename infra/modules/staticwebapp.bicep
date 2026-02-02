// Azure Static Web Apps module
// Hosts the Vite React frontend with GitHub integration

param location string
param staticWebAppName string
param githubRepo string
param githubBranch string
param functionAppUrl string

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/${githubRepo}'
    branch: githubBranch
    buildProperties: {
      appLocation: '/'
      appArtifactLocation: 'dist'
      outputLocation: 'dist'
      skipGithubActionWorkflowGeneration: false
    }
    stagingEnvironmentPolicy: 'Disabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
  }
}

// Environment variables for SPA
resource swaAppSettings 'Microsoft.Web/staticSites/appsettings@2023-12-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    VITE_API_URL: 'https://${functionAppUrl}/api'
    VITE_ENVIRONMENT: 'production'
  }
}

// Linked function app (optional - direct integration)
resource linkedFunctionApp 'Microsoft.Web/staticSites/linkedBackends@2023-12-01' = {
  parent: staticWebApp
  name: 'api'
  properties: {
    backendResourceId: '/subscriptions/${subscription().subscriptionId}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/func-lejio-fri-dev'
  }
}

// Output
output defaultHostname string = staticWebApp.properties.defaultHostname
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
