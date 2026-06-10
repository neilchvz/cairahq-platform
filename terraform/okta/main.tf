terraform {
  required_providers {
    okta = {
      source  = "okta/okta"
      version = "~> 4.0"
    }
  }

  required_version = ">= 1.0"

  # Remote state note:
  # In a production environment, state would be stored remotely (Terraform Cloud,
  # S3 + DynamoDB locking, etc.) to support team collaboration, state locking,
  # and audit history. Local state is used here as this is a single-operator
  # lab environment.
}

provider "okta" {
  org_name  = var.okta_org_name
  base_url  = "okta.com"
  api_token = var.okta_api_token
}