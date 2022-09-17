help:
	@echo "make <test | local | goerli>"

test:
	npx hardhat run scripts/run.js

local:
	npx hardhat run scripts/deploy.js --network localhost | tee log.local

goerli:
	npx hardhat run scripts/deploy.js --network goerli | tee log.goerli
	@awk -F: 'BEGIN{print "{"} END{print"\"dummy\":null}"} {gsub(/ /,"_",$$1); gsub(/ /,"",$$2); printf("\"%s\":\"%s\",\n",$$1,$$2)}' log.goerli > log.goerli.json
	@cat log.goerli.json

.PHONY: help test local goerli
