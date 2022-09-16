help:
	@echo "make <test | local>"

test:
	npx hardhat run scripts/run.js

local:
	npx hardhat run scripts/deploy.js --network localhost | tee log.local

goerli:
	npx hardhat run scripts/deploy.js --network goerli | tee log.goerli
