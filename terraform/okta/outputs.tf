# User IDs — dynamically output all users from the roster
output "user_ids" {
  description = "Okta user IDs for all provisioned users, keyed by login"
  value       = { for login, user in okta_user.users : login => user.id }
}

# Group IDs
output "google_workspace_group_id" {
  description = "Okta group ID for the Google Workspace SSO/SCIM group"
  value       = data.okta_group.google_workspace.id
}

output "okta_admins_group_id" {
  description = "Okta group ID for the Okta Administrators system group"
  value       = data.okta_group.okta_admins.id
}

# App IDs
output "google_workspace_app_id" {
  description = "Okta app ID for the Google Workspace application"
  value       = data.okta_app.google_workspace.id
}