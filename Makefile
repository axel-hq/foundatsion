/ := $(dir $(MAKEFILE_LIST))

ifeq ($(OS), Windows_NT)
	PATH := $/node_modules/.bin;$(PATH)
else
	PATH := $/node_modules/.bin:$(PATH)
endif

build: cjs es6 dts
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

cjs: clean
	tsc --module commonjs --outDir bin/cjs
.PHONY: cjs

es6: clean
	tsc --module es2020 --outDir bin/es6
.PHONY: es6

dts: clean
	tsc --module es2020 --emitDeclarationOnly --declaration --declarationDir bin/dts
	node add_command_comments
.PHONY: dts

zzz: cjs
	node $@
.PHONY: zzz

test:
	ava --verbose
.PHONY: test

publish: build
	npm publish --dry-run

publish!: build
	npm publish --no-git-tag-version --access public
