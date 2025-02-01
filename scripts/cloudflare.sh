#!/bin/bash

DOMAIN="mbwin.bet"
PREFIX="mereb-ats"
CONFIG_FILE="/etc/cloudflared/config.yml"
CLOUDFLARED_BIN="cloudflared"
TUNNEL_NAME="mbwin"
CREDENTIALS_FILE="/root/.cloudflared/67aae0c8-b1b0-4077-b12c-3d7e779d4c37.json"


# Retrieve the dynamically assigned port from the cli argument
PORT=$1

if [ -n "$PORT" ]; then
    # Create a subdomain for this port
    SUBDOMAIN="${PREFIX}-${PORT}.${DOMAIN}"

    "$CLOUDFLARED_BIN" tunnel route dns "$TUNNEL_NAME" "${SUBDOMAIN}"

    # Check if the subdomain already exists in config.yml to avoid duplicates
    if ! grep -q "hostname: $SUBDOMAIN" "$CONFIG_FILE"; then
        # Insert new ingress rule just before the "http_status:404" line
        sed -i "/service: http_status:404/i \  - hostname: ${SUBDOMAIN}\n    service: http://127.0.0.1:${PORT}" "$CONFIG_FILE"

        systemctl restart cloudflared
        echo "Added ${SUBDOMAIN} -> localhost:${PORT} to config.yml"
    else
        echo "${SUBDOMAIN} already exists in config.yml"
    fi
else
    echo "No port mapping found for container ${CONTAINER_ID}"
fi

