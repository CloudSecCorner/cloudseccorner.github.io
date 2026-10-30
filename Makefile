.PHONY: setup export test format dev readme aws-architectures azure-architectures

setup:
	mix local.hex --force
	mix local.rebar --force
	mix deps.get
	mix deps.compile
	npm install

dev:
	mix run --no-halt

test:
	mix test
	npm test

format:
	mix format

aws-architectures:
	node scripts/generate_aws_best_practices.js

azure-architectures:
	node scripts/generate_azure_best_practices.js

readme:
	python3 scripts/update_readme_tools.py

export: readme aws-architectures azure-architectures
	mix site.export --output _site
