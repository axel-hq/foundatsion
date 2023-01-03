/ := $(dir $(MAKEFILE_LIST))

ifeq ($(OS), Windows_NT)
	PATH := $/node_modules/.bin;$(PATH)
else
	PATH := $/node_modules/.bin:$(PATH)
endif

build: clean cjs es6 dts
	-
.PHONY: build

errors:
	tsc --noEmit
.PHONY: errors

clean:
ifeq ($(OS), Windows_NT)
	-rd /s /q bin
else
	-rm -rf bin
endif
.PHONY: clean

cjs:
	tsc -p tsconfig.cjs.json

es6: $(src_files)
	tsc -p tsconfig.esm.json

dts: es6
	node add_command_comments
.PHONY: dts

test:
	tsc -p tsconfig.spec.json
	ava bin/spec --verbose
.PHONY: test

publish: build
	npm publish --dry-run

publish!: build
	npm publish --no-git-tag-version --access public
