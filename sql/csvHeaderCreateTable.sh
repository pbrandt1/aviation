#!/bin/bash

filename=$(basename "$1")
filename="${filename%.*}"

echo "drop table if exists ${filename}_tbl;" > /tmp/${filename}.sql
head $1 -n 1 | sed 's/\([a-z]\)\([A-Z]\)/\1\_\2/g' | sed 's/\([A-Z0-9]\)\([A-Z0-9][a-z]\)/\1\_\2/g' | sed 's/,/\ varchar,\ /g' | sed "s/\(.*\)/create\ table\ ${filename}_tbl\ (\1\ varchar);/" >> /tmp/${filename}.sql

sudo -u postgres psql -d pilot < /tmp/${filename}.sql

echo "copy ${filename}_tbl from '$1' delimiter ',' csv;" > /tmp/copy.sql

sudo -u postgres psql -d pilot < /tmp/copy.sql
