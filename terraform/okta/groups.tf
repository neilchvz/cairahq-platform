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

# Contractors group — for external contractors and vendors
# Members are granted scoped access based on app assignments
resource "okta_group" "contractors" {
  name        = "Contractors"
  description = "External contractors and vendors. Access is scoped per engagement — members are not automatically provisioned into Google Workspace."
}