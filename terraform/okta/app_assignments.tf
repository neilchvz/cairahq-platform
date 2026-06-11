# Google Workspace app assignment
# The SSO/SCIM group controls both app access and SCIM provisioning into Google Workspace

data "okta_app" "google_workspace" {
  label = "Google Workspace"
}

resource "okta_app_group_assignment" "google_workspace" {
  app_id   = data.okta_app.google_workspace.id
  group_id = data.okta_group.google_workspace.id
}