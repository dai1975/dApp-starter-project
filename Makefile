help:
	@echo "make <start>"

local goerli:
	$(MAKE) -C my-wave-portal $@

start: src/utils/WavePortal.json src/utils/log.goerli.json
	cat src/utils/log.goerli.json
	cd src; HOST=0.0.0.0 PORT=3000 npm run start

src/utils/WavePortal.json: ./my-wave-portal/artifacts/contracts/WavePortal.sol/WavePortal.json
	cp $? $@

src/utils/log.goerli.json: ./my-wave-portal/log.goerli.json
	cp $? $@

clean:
	rm -f src/utils/WavePortal.json src/utils/log.goerli.json

.PHONY: help start clean
