#!/bin/bash

sudo -u postgres createdb pilot

./csvHeaderCreateTable.sh airpots.csv
./csvHeaderCreateTable.sh nfdcFacilities.csv
