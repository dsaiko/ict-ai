.PHONY: help build preview clean deploy-s3 deploy-s3-dryrun deploy-invalidate deploy

# Lokální overrides (AWS_PROFILE, S3_BUCKET, S3_PATH, CLOUDFRONT_DIST).
# Soubor Makefile.local není součástí gitu — viz .gitignore.
-include Makefile.local

# Cíl deploye. S3_PATH je podadresář pod bucketem a MUSÍ končit lomítkem
# (např. "ai/"). Web se nasazuje pod https://www.saiko.cz/ai/.
S3_BUCKET        ?=
S3_PATH          ?=
AWS_PROFILE      ?=
CLOUDFRONT_DIST  ?=

PREVIEW_PORT     ?= 8080

# Statický web bez build nástroje — "build" jen poskládá dist/ z HTML stránek
# (bez Makefile, README a obrázků pro GitHub, které na webu nejsou potřeba).
help:
	@echo "Základy AI — interaktivní ukázky — dostupné cíle:"
	@echo "  make build              — poskládá dist/ z *.html"
	@echo "  make preview            — náhled dist/ na http://localhost:$(PREVIEW_PORT)"
	@echo "  make clean              — smaže dist/"
	@echo ""
	@echo "  make deploy             — build + sync na S3 + CloudFront invalidace"
	@echo "  make deploy-s3          — nahraje dist/ do s3://$(S3_BUCKET)/$(S3_PATH)"
	@echo "  make deploy-s3-dryrun   — totéž nanečisto (--dryrun, nic nezmění)"
	@echo "  make deploy-invalidate  — invalidace CloudFront na cestě /$(S3_PATH)*"
	@echo ""
	@echo "Konfigurace deploye je v Makefile.local (mimo git)."
	@echo "Live: https://www.saiko.cz/$(S3_PATH)"

build:
	rm -rf dist
	mkdir -p dist
	cp *.html dist/
	@echo "→ dist/ obsahuje:" && ls -1 dist/

preview: build
	@echo "→ http://localhost:$(PREVIEW_PORT)/  (Ctrl-C ukončí)"
	cd dist && python3 -m http.server $(PREVIEW_PORT)

clean:
	rm -rf dist

# --- deploy ---------------------------------------------------------------
# S3_PATH se kontroluje záměrně: prázdná hodnota by s --delete smazala kořen
# bucketu (celé www.saiko.cz).

deploy-s3: build
	@test -n "$(AWS_PROFILE)" || { echo "AWS_PROFILE není nastaven — vytvoř Makefile.local"; exit 1; }
	@test -n "$(S3_BUCKET)"   || { echo "S3_BUCKET není nastaven — vytvoř Makefile.local"; exit 1; }
	@test -n "$(S3_PATH)"     || { echo "S3_PATH není nastaven — deploy do kořene bucketu by smazal celý web. Nastav např. ai/ v Makefile.local"; exit 1; }
	@echo "→ s3://$(S3_BUCKET)/$(S3_PATH)"
	aws s3 sync --profile $(AWS_PROFILE) ./dist/ s3://$(S3_BUCKET)/$(S3_PATH) --delete

deploy-s3-dryrun: build
	@test -n "$(AWS_PROFILE)" || { echo "AWS_PROFILE není nastaven — vytvoř Makefile.local"; exit 1; }
	@test -n "$(S3_BUCKET)"   || { echo "S3_BUCKET není nastaven — vytvoř Makefile.local"; exit 1; }
	@test -n "$(S3_PATH)"     || { echo "S3_PATH není nastaven — vytvoř Makefile.local"; exit 1; }
	aws s3 sync --profile $(AWS_PROFILE) ./dist/ s3://$(S3_BUCKET)/$(S3_PATH) --delete --dryrun

deploy-invalidate:
	@test -n "$(AWS_PROFILE)"     || { echo "AWS_PROFILE není nastaven — vytvoř Makefile.local"; exit 1; }
	@test -n "$(CLOUDFRONT_DIST)" || { echo "CLOUDFRONT_DIST není nastaven — vytvoř Makefile.local"; exit 1; }
	@test -n "$(S3_PATH)"         || { echo "S3_PATH není nastaven — vytvoř Makefile.local"; exit 1; }
	@echo "→ invalidace /$(S3_PATH)*"
	aws cloudfront create-invalidation \
		--profile $(AWS_PROFILE) \
		--distribution-id $(CLOUDFRONT_DIST) \
		--paths "/$(S3_PATH)*"

deploy: deploy-s3 deploy-invalidate
