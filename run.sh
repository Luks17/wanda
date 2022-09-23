#!/bin/bash

main_dir=$(pwd)
env=$main_dir/venv
node_dir=$main_dir/node_modules
models_dir=$main_dir/models
# declaring the best models available for each language
english_model="vosk-model-en-us-0.22"
portuguese_model="vosk-model-pt-fb-v0.1.1-20220516_2113"
spanish_model="vosk-model-es-0.42"

# checks if main project directories exist and starts them if not
if [ ! -d "$models_dir" ]; then
	mkdir $models_dir
fi
if [ ! -d "$env" ]; then
	python -m venv venv
	$env/bin/pip install -r requirements.txt
fi
if [ ! -d "$node_dir" ]; then
	npm install
fi


cd $models_dir

# checks in $models_dir if the models directories exist, downloads and extracts them if not
if [ ! -d "$portuguese_model" ]; then
	printf "\nDownloading ${portuguese_model}\n"
	curl -O https://alphacephei.com/vosk/models/${portuguese_model}.zip
	python $main_dir/python_scripts/extract_file.py $models_dir/${portuguese_model}.zip
fi
if [ ! -d "$spanish_model" ]; then
	printf "\nDownloading ${spanish_model}\n"
	curl -O https://alphacephei.com/vosk/models/${spanish_model}.zip
	python $main_dir/python_scripts/extract_file.py $models_dir/${spanish_model}.zip
fi
if [ ! -d "$english_model" ]; then
	printf "\nDownloading ${english_model}\n"
	curl -O https://alphacephei.com/vosk/models/${english_model}.zip
	python $main_dir/python_scripts/extract_file.py $models_dir/${english_model}.zip
fi

cd $main_dir

export MODELS_DIR=$models_dir
export ENGLISH_MODEL=$english_model
export PORTUGUESE_MODEL=$portuguese_model
export SPANISH_MODEL=$spanish_model

npm start
