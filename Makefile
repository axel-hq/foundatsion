. := $(dir $(MAKEFILE_LIST))
all_deps := $(MAKEFILE_LIST) $(wildcard src/*.ts)

ifeq ($(OS), Windows_NT)
	PATH := $./node_modules/.bin;$(PATH)
else
	PATH := $./node_modules/.bin:$(PATH)
endif

errors:
	tsc --noEmit

cjs: $(cjs_files)
	-

build: bin/es2020 bin/commonjs bin/dts
	-

bin/%: $(all_deps)
	tsc --module $* --outDir $@

bin/dts: $(all_deps)
	tsc --module es6 --emitDeclarationOnly --declaration --declarationDir $@
