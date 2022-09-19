#!/bin/bash

env=./venv
node_dir=./node_modules

if [ ! -d "$env" ]; then
	python -m venv venv
	$env/bin/pip install -r requirements.txt
fi
if [ ! -d "$node_dir" ]; then
	npm install
fi

npm start
