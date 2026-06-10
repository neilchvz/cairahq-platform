# Google Workspace SCIM provisioning group
# Members are automatically provisioned into Google Workspace via SCIM
resource "okta_group" "google_workspace_scim" {
  name        = "Google Workspace SCIM"
  description = "SCIM provisioning group for Google Workspace. Members are automatically provisioned into Google Workspace."
}

# Google Workspace SSO group — existing, managed outside Terraform
# Referenced here as a data source for group membership assignments
data "okta_group" "google_workspace_sso" {
  name = "Google Workspace SSO"
}

# Okta Administrators group — system managed, cannot be created via Terraform
data "okta_group" "okta_admins" {
  name = "Okta Administrators"
}