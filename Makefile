help:
	@echo "make <start>"

start: src/utils/WavePortal.json src/utils/log.goerli.json
	cd src; npm run start

src/utils/WavePortal.json: ./my-wave-portal/artifacts/contracts/WavePortal.sol/WavePortal.json
	cp $? $@

src/utils/log.goerli.json: ./my-wave-portal/log.goerli.json
	cp $? $@

clean:
	rm -f src/utils/WavePortal.json src/utils/log.goerli.json

.PHONY: help start clean
