#!/bin/bash

python backend/manage.py dumpdata \
    --natural-foreign --natural-primary -e \
    contenttypes -e auth.Permission --indent 2 > backend/data.json

echo "Saved current state to backend/data.json"