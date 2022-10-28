. := $(dir $(MAKEFILE_LIST))
all_deps := $(MAKEFILE_LIST) $(wildcard src/*.ts)

ifeq ($(OS), Windows_NT)
	PATH := $./node_modules/.bin;$(PATH)
else
	PATH := $./node_modules/.bin:$(PATH)
endif

errors:
	tsc --noEmit
.PHONY: errors

clean:
	rd /s /q bin
.PHONY: clean

cjs: clean
	tsc --module commonjs --outDir bin/cjs
.PHONY: cjs

es6: clean
	tsc --module es6 --outDir bin/es6
.PHONY: es6

dts: clean
	tsc --module es6 --emitDeclarationOnly --declaration --declarationDir bin/es6
.PHONY: dts

build: cjs es6 dts
	-
.PHONY: build

publish: build
	npm publish --dry-run

publish!: build
	npm publish --no-git-tag-version --access public
