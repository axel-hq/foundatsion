clean:
ifeq ($(OS), Windows_NT)
	-rd /s /q bin
else
	-rm -rf bin
endif
.PHONY: clean

publish:
	npm run build
	npm publish --dry-run

publish!:
	npm run build
	npm publish --no-git-tag-version --access public
