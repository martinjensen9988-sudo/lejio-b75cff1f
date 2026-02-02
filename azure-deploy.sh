#!/bin/bash

# Azure Deployment Script for Lejio Fri
# Run this in Azure Cloud Shell or with Azure CLI installed locally
# bash azure-deploy.sh

set -e

echo "🚀 Starting Azure Deployment for Lejio Fri..."

# Configuration
RESOURCE_GROUP="lejio-fri-rg"
LOCATION="eastus"
PROJECT_NAME="lejio-fri"
ENVIRONMENT="dev"
DEPLOYMENT_NAME="lejio-fri-deployment-$(date +%s)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Project: $PROJECT_NAME"
echo "  Environment: $ENVIRONMENT"
echo ""

# Step 1: Verify Azure CLI
echo -e "${BLUE}1️⃣  Verifying Azure CLI...${NC}"
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi
echo -e "${GREEN}✅ Azure CLI found: $(az --version | head -1)${NC}"
echo ""

# Step 2: Login
echo -e "${BLUE}2️⃣  Logging in to Azure...${NC}"
az login
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${GREEN}✅ Logged in. Subscription ID: $SUBSCRIPTION_ID${NC}"
echo ""

# Step 3: Create Resource Group
echo -e "${BLUE}3️⃣  Creating Resource Group...${NC}"
if az group exists -n $RESOURCE_GROUP -o tsv | grep -q true; then
    echo "  Resource group already exists"
else
    az group create \
        --name $RESOURCE_GROUP \
        --location $LOCATION
fi
echo -e "${GREEN}✅ Resource group ready: $RESOURCE_GROUP${NC}"
echo ""

# Step 4: Validate Deployment
echo -e "${BLUE}4️⃣  Validating Bicep template...${NC}"
az deployment group validate \
    --resource-group $RESOURCE_GROUP \
    --template-file infra/main.bicep \
    --parameters infra/main.parameters.json
echo -e "${GREEN}✅ Template validation passed${NC}"
echo ""

# Step 5: Preview Deployment
echo -e "${BLUE}5️⃣  Previewing deployment (what-if)...${NC}"
echo "  This shows what will be created/modified:"
echo ""
az deployment group what-if \
    --resource-group $RESOURCE_GROUP \
    --template-file infra/main.bicep \
    --parameters infra/main.parameters.json
echo ""

# Step 6: Confirm Deployment
echo -e "${BLUE}6️⃣  Ready to deploy. Continue? (y/n)${NC}"
read -p "  > " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi
echo ""

# Step 7: Deploy Infrastructure
echo -e "${BLUE}7️⃣  Deploying infrastructure...${NC}"
echo "  This may take 5-10 minutes..."
echo ""

az deployment group create \
    --name $DEPLOYMENT_NAME \
    --resource-group $RESOURCE_GROUP \
    --template-file infra/main.bicep \
    --parameters infra/main.parameters.json

echo -e "${GREEN}✅ Infrastructure deployed${NC}"
echo ""

# Step 8: Get Deployment Outputs
echo -e "${BLUE}8️⃣  Retrieving deployment outputs...${NC}"
echo ""

OUTPUTS=$(az deployment group show \
    --name $DEPLOYMENT_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.outputs -o json)

echo "Deployment Outputs:"
echo "$OUTPUTS" | jq '.'

# Extract values
SQL_SERVER=$(echo "$OUTPUTS" | jq -r '.sqlServerName.value')
STATIC_WEB_APP=$(echo "$OUTPUTS" | jq -r '.staticWebAppUrl.value' 2>/dev/null || echo "N/A")
FUNCTION_APP=$(echo "$OUTPUTS" | jq -r '.functionAppUrl.value' 2>/dev/null || echo "N/A")
KEY_VAULT=$(echo "$OUTPUTS" | jq -r '.keyVaultUrl.value' 2>/dev/null || echo "N/A")
STORAGE=$(echo "$OUTPUTS" | jq -r '.storageAccountName.value')

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Important Information:${NC}"
echo "  SQL Server: $SQL_SERVER"
echo "  Storage Account: $STORAGE"
echo "  Static Web App: $STATIC_WEB_APP"
echo "  Function App: $FUNCTION_APP"
echo "  Key Vault: $KEY_VAULT"
echo ""

# Step 9: Next Steps
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Update .env.azure with Azure resource values:"
echo "   VITE_API_URL=https://${FUNCTION_APP}/api"
echo "   VITE_SQL_SERVER=${SQL_SERVER}"
echo ""
echo "2. Configure GitHub Static Web Apps:"
echo "   - Go to Azure Portal → Static Web Apps → swa-lejio-fri-dev"
echo "   - Copy Repository token from Overview"
echo "   - Add to GitHub Secrets: AZURE_STATIC_WEB_APPS_API_TOKEN"
echo ""
echo "3. Run database migrations:"
echo "   sqlcmd -S ${SQL_SERVER}.database.windows.net -U sqladmin -P <PASSWORD> -d lejio-fri"
echo "   > :r supabase/migrations/azure-sql/001_initial_schema.sql"
echo "   > :r supabase/migrations/azure-sql/006_test_martin_account.sql"
echo ""
echo "4. Deploy Azure Functions:"
echo "   cd azure-functions"
echo "   func azure functionapp publish func-lejio-fri-dev"
echo ""
echo "5. Push to GitHub to trigger Static Web Apps auto-deployment:"
echo "   git add ."
echo "   git commit -m 'Migrate to Azure'"
echo "   git push origin main"
echo ""

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
