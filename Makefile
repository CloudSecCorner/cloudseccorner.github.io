.PHONY: setup export test format dev readme

setup:
	mix local.hex --force
	mix local.rebar --force
	mix deps.get
	mix deps.compile

dev:
	mix run --no-halt

test:
	mix test

format:
	mix format

readme:
	python3 scripts/update_readme_tools.py

export: readme
	mix site.export --output _site
