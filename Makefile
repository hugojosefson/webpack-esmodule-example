include node_modules/gnumake/gnumake.mk
rwildcard=$(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d)) # via https://blog.jgc.org/2011/07/gnu-make-recursive-wildcard-function.html

BUILD := target/build
PROD := target/prod
DEV := target/dev

PARCEL := node_modules/.bin/parcel
HTML_TOKENIZE := node_modules/.bin/html-tokenize
HTML_SELECT := node_modules/.bin/html-select
SERVE := node_modules/.bin/serve

.PHONY: build
build:
	$(MAKE) -j $(PROD)/index.html

.PHONY: clean
clean:
	$(RM) -rf target .parcel-cache *.log

.PHONY: serve
serve: build
	$(SERVE) $(PROD)

.PHONY: dev
dev:
	$(MAKE) -j dev-modern dev-legacy

.PHONY: dev-%
dev-%: src/variant/%/dev/index.html $(DEV)/port-%
	$(MKDIRP) $(DEV)/variant/$*
	( BROWSERSLIST_ENV=$* \
	$(PARCEL) serve \
	--port $(shell $(CAT) $(DEV)/port-$*) \
	--dist-dir $(DEV)/variant/$* \
	--target $*-dev \
	$< )

$(DEV)/port-modern: $(DEV)
	echo 1234 > $(DEV)/port-modern

$(DEV)/port-legacy: $(DEV)
	echo 1235 > $(DEV)/port-legacy

$(DEV):
	$(MKDIRP) $(DEV)

$(PROD)/index.html: $(BUILD)/root/index.html $(call rwildcard,$(BUILD)/root/,*) $(BUILD)/script-tag-legacy $(BUILD)/script-tag-modern $(BUILD)/variant/legacy/index.html $(BUILD)/variant/modern/index.html $(call rwildcard,$(BUILD)/variant/,*)
	$(MKDIRP) $(PROD)
	$(RM) -rf $(PROD)
	$(MKDIRP) $(PROD)
	$(CP) -r $(BUILD)/root/* $(BUILD)/variant/* $(PROD)
	$(CAT) $< \
	| $(SED) -E 's#<script type="placeholder"></script>#''$(shell $(CAT) $(BUILD)/script-tag-*)''#' \
	> $@
	$(RM) $(PROD)/*/index.html

$(BUILD)/script-tag-%: $(BUILD)/variant/%/index.html
	$(MKDIRP) $(@D)
	$(HTML_TOKENIZE) < $< | $(HTML_SELECT) --raw 'script' > $@

$(BUILD)/root/index.html: src/root/index.html $(call rwildcard,src/root/,*)
	$(MKDIRP) $(BUILD)/root
	$(FIND) $(BUILD)/root -type f -not -name index.html -delete
	$(PARCEL) build --public-url . --no-source-maps --target root src/root/index.html

$(BUILD)/variant/%/index.html: src/variant/%/prod/index.html $(call rwildcard,src/common/,*) $(call rwildcard,src/variant/%/prod/,*)
	$(MKDIRP) $(@D)
	$(FIND) $(@D) -type f -not -name index.html -delete
	( BROWSERSLIST_ENV=$* $(PARCEL) build --public-url $*/ --target $* $< )
