variable "okta_org_name" {
  description = "Okta organization name (subdomain only, e.g. 'integrator-7484148')"
  type        = string
}

variable "okta_api_token" {
  description = "Okta API token. Pass via TF_VAR_okta_api_token environment variable — never commit this value."
  type        = string
  sensitive   = true
}