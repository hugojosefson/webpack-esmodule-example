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
	( BROWSERSLIST_ENV=$* \
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

$(DIST)/index.html: $(BUILD)/index.html $(BUILD)/script-tag-legacy $(BUILD)/script-tag-modern $(BUILD)/legacy/index.html $(BUILD)/modern/index.html
	$(MKDIRP) $(DIST)
	$(CP) -r $(BUILD)/* $(DIST)
	$(CAT) $< \
	| $(SED) -E 's#<script type="placeholder"></script>#''$(shell $(CAT) $(BUILD)/script-tag-*)''#' \
	> $@
	$(RM) $(DIST)/*/index.html $(DIST)/script-tag-*

$(BUILD)/script-tag-%: $(BUILD)/%/index.html
	$(MKDIRP) $(@D)
	$(HTML_TOKENIZE) < $< | $(HTML_SELECT) --raw 'script' > $@

$(BUILD)/index.html: src/index.html
	$(MKDIRP) $(BUILD)
	$(PARCEL) build --public-url . --no-source-maps --target index.html src/index.html

$(BUILD)/%/index.html: src/index-%.html
	$(MKDIRP) $(@D)
	( BROWSERSLIST_ENV=$* $(PARCEL) build --public-url $*/ --target $* $< )
