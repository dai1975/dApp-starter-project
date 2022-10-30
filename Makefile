help:
	@echo "make <start>"

local goerli:
	$(MAKE) -C my-wave-portal $@

start: src/contract_configs/WavePortal.json src/contract_configs/log.goerli.json
	cat src/contract_configs/log.goerli.json
	cd src; HOST=0.0.0.0 PORT=3000 npm run start

src/contract_configs/WavePortal.json: ./my-wave-portal/artifacts/contracts/WavePortal.sol/WavePortal.json
	cp $? $@

src/contract_configs/log.goerli.json: ./my-wave-portal/log.goerli.json
	cp $? $@

clean:
	rm -f src/contract_configs/WavePortal.json src/contract_configs/log.goerli.json

.PHONY: help start clean local goerli
