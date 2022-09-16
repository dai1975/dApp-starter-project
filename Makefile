start: src/utils/WavePortal.json
	cd src; npm run start

src/utils/WavePortal.json: ./my-wave-portal/artifacts/contracts/WavePortal.sol/WavePortal.json
	cp $? $@
