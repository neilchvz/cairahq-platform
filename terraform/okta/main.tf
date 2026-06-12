terraform {
  cloud {
    organization = "cairahq"

    workspaces {
      name = "cairahq-platform"
    }
  }

  required_providers {
    okta = {
      source  = "okta/okta"
      version = "~> 4.0"
    }
  }

  required_version = ">= 1.0"

  # Remote state note:
  # State is stored remotely in HCP Terraform (Terraform Cloud). This supports
  # state locking, audit history, and team collaboration — the same pattern
  # used in production environments. Local state was used initially and migrated
  # to remote state once the CI/CD pipeline was introduced.
}

provider "okta" {
  org_name  = var.okta_org_name
  base_url  = "okta.com"
  api_token = var.okta_api_token
}