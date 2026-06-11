# Load user roster from CSV
# In production this data would come from an HRIS API (BambooHR, Workday, Rippling, etc.)
# The CSV is the lab equivalent of that data source
locals {
  users = csvdecode(file("${path.module}/data/users.csv"))
}

# Dynamically create one Okta user per row in users.csv
resource "okta_user" "users" {
  for_each = { for user in local.users : user.login => user }

  first_name                = each.value.first_name
  last_name                 = each.value.last_name
  login                     = each.value.login
  email                     = each.value.email
  title                     = each.value.title
  manager                   = each.value.manager
  organization              = each.value.organization
  department                = each.value.department
  division                  = each.value.division
  user_type                 = each.value.user_type
  password                  = var.default_temp_password
  expire_password_on_create = true
  status                    = "ACTIVE"
}

# Group membership — SSO/SCIM
# All users in the roster are assigned to the Google Workspace SSO/SCIM group
resource "okta_group_memberships" "google_workspace" {
  group_id = data.okta_group.google_workspace.id
  users    = [for user in okta_user.users : user.id]
}