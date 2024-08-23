#!/bin/bash

KEYS_DIR="keys"

mkdir -p $KEYS_DIR

# Generate a 2048-bit RSA private key
openssl genpkey -algorithm RSA -out $KEYS_DIR/access_token_private_key.pem -pkeyopt rsa_keygen_bits:2048

# Extract the public key from the private key
openssl rsa -pubout -in $KEYS_DIR/access_token_private_key.pem -out $KEYS_DIR/access_token_public_key.pem

# Convert the private key to Base64 and save it
openssl base64 -in $KEYS_DIR/access_token_private_key.pem -out $KEYS_DIR/access_token_private_key_base64.txt

# Convert the public key to Base64 and save it
openssl base64 -in $KEYS_DIR/access_token_public_key.pem -out $KEYS_DIR/access_token_public_key_base64.txt

echo "Keys generated and saved to $KEYS_DIR"