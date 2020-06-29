include node_modules/gnumake/gnumake.mk

BUILD := target/build
DIST := target/dist
DEV := target/dev

PARCEL := node_modules/.bin/parcel
HTML_TOKENIZE := node_modules/.bin/html-tokenize
HTML_SELECT := node_modules/.bin/html-select
SERVE := node_modules/.bin/serve

.PHONY: build
build:
	$(MAKE) -j $(DIST)/index.html

.PHONY: clean
clean:
	$(RM) -rf target .parcel-cache *.log

.PHONY: serve
serve: build
	$(SERVE) $(DIST)

.PHONY: dev
dev:
	$(MAKE) -j dev-modern dev-legacy

.PHONY: dev-%
dev-%: src/index-%-dev.html $(DEV)/%/port
	$(MKDIRP) $(DEV)/$*
	( BROWSERSLIST_ENV=dev-$* \
	$(PARCEL) serve \
	--port $(shell $(CAT) $(DEV)/$*/port) \
	--dist-dir $(DEV)/$* \
	--target dev-$* \
	$< )

$(DEV)/modern/port:
	$(MKDIRP) $(DEV)/modern
	echo 1234 > $(DEV)/modern/port

$(DEV)/legacy/port:
	$(MKDIRP) $(DEV)/legacy
	echo 1235 > $(DEV)/legacy/port

$(DIST)/index.html: $(BUILD)/index.html $(BUILD)/script-name-legacy $(BUILD)/script-name-modern $(BUILD)/legacy/index.html $(BUILD)/modern/index.html
	$(MKDIRP) $(DIST)
	$(CP) -r $(BUILD)/* $(DIST)
	$(CAT) $< \
	| $(SED) -E "s#LEGACY_SOURCE_FILE_PLACEHOLDER#$(shell $(CAT) $(BUILD)/script-name-legacy)#g" \
	| $(SED) -E "s#MODERN_SOURCE_FILE_PLACEHOLDER#$(shell $(CAT) $(BUILD)/script-name-modern)#g" \
	> $@
	$(RM) $(DIST)/*/index.html $(DIST)/script-name-*

$(BUILD)/script-name-%: $(BUILD)/%/index.html
	$(MKDIRP) $(@D)
	$(HTML_TOKENIZE) < $< \
	| $(HTML_SELECT) 'head script[src]' \
	| $(GREP) -E '^\["open"' \
	| $(SED) -E 's#^.*src=\\"([^\]+).*#\1#' \
	> $@

$(BUILD)/index.html: src/index.html
	$(MKDIRP) $(BUILD)
	$(PARCEL) build --public-url . --no-source-maps --target index.html src/index.html

$(BUILD)/%/index.html: src/index-%.html
	$(MKDIRP) $(@D)
	( BROWSERSLIST_ENV=$* $(PARCEL) build --public-url . --target $* $< )
