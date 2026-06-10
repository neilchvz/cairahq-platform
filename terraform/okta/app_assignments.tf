# Google Workspace app assignment
# The SSO group controls who can access the Google Workspace app in Okta
# The SCIM group controls who gets provisioned into Google Workspace

data "okta_app" "google_workspace" {
  label = "Google Workspace"
}

resource "okta_app_group_assignment" "google_workspace" {
  app_id   = data.okta_app.google_workspace.id
  group_id = data.okta_group.google_workspace_sso.id
}