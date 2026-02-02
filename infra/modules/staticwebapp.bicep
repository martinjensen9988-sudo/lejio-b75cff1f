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
      apiLocation: '' // Use Azure Functions instead
      appArtifactLocation: 'dist'
      outputLocation: 'dist'
      apiLanguage: 'node'
      apiVersion: '18'
      skipGithubActionWorkflowGeneration: false
    }
    // Environment configuration
    stagingEnvironmentPolicy: 'Disabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
  }
}

// Route configuration for SPA fallback
resource spaFallbackRoute 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: staticWebApp
  name: 'web'
  properties: {
    // Default SPA route config - all unknown routes serve index.html
  }
}

// Environment variables for SPA
resource swaAppSettings 'Microsoft.Web/staticSites/config@2023-12-01' = {
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
    functionAppResourceId: '/subscriptions/${subscription().subscriptionId}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/func-lejio-fri-dev'
    region: location
    backendResourceId: '/subscriptions/${subscription().subscriptionId}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/func-lejio-fri-dev'
  }
}

// Output
output defaultHostname string = staticWebApp.properties.defaultHostname
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
output repositoryToken string = staticWebApp.listSecrets().repositoryToken
