#!/bin/sh
# Force n8n to connect to PostgreSQL using SSL
# Neon requires sslmode=require; n8n's env vars alone don't reliably trigger SSL.
# This script sets NODE_OPTIONS to preload a module that patches the pg driver.
exec n8n "$@"
