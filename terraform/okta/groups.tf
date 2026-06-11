# Google Workspace SSO/SCIM group — existing, managed outside Terraform
# Handles both SSO app access and SCIM provisioning into Google Workspace
# Referenced here as a data source for group membership assignments
data "okta_group" "google_workspace" {
  name = "Google Workspace SSO/SCIM"
}

# Okta Administrators group — system managed, cannot be created via Terraform
data "okta_group" "okta_admins" {
  name = "Okta Administrators"
}