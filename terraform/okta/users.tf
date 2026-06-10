# Neil Chavez — admin and primary user
resource "okta_user" "neil" {
  first_name = "Neil"
  last_name  = "Chavez"
  login      = "neil@cairahq.com"
  email      = "neil@cairahq.com"
}

# Group membership — SSO access
resource "okta_group_memberships" "neil_sso" {
  group_id = data.okta_group.google_workspace_sso.id
  users    = [okta_user.neil.id]
}

# Group membership — SCIM provisioning
resource "okta_group_memberships" "neil_scim" {
  group_id = okta_group.google_workspace_scim.id
  users    = [okta_user.neil.id]
}

# --- Add users below this line ---