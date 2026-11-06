.PHONY: setup export test format dev react-dev readme aws-architectures azure-architectures

setup:
	mix local.hex --force
	mix local.rebar --force
	mix deps.get
	mix deps.compile
	npm ci

dev:
	npm run build
	mix run --no-halt

react-dev:
	npm run dev

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

export: readme
	npm run build
	mix site.export --require-frontend --output _site
	npm run test:export
