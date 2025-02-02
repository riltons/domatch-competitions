#!/bin/bash

# Import workflows
for workflow in workflows/*.json; do
  curl -X POST http://localhost:5678/rest/workflows \
    -H "accept: application/json" \
    -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
    -H "Content-Type: application/json" \
    -d @"$workflow"
done
