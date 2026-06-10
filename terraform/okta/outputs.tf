# User IDs
output "neil_user_id" {
  description = "Okta user ID for neil@cairahq.com"
  value       = okta_user.neil.id
}

# Group IDs
output "google_workspace_group_id" {
  description = "Okta group ID for the Google Workspace SCIM provisioning group"
  value       = okta_group.google_workspace.id
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