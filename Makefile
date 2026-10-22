.PHONY: setup export test format dev

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

export:
	mix site.export --output _site
