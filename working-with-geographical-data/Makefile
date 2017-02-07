all: clean london-9.topo.json

source:
	mkdir source
	curl -O 'https://files.datapress.com/london/dataset/statistical-gis-boundary-files-london/2016-10-03T13:52:28/statistical-gis-boundaries-london.zip'
	unzip -j statistical-gis-boundaries-london.zip -d source
	rm statistical-gis-boundaries-london.zip

london-1.geo.json: source
	shp2json \
		source/London_Borough_Excluding_MHW.shp \
		> london-1.geo.json

london-2.geo.json: london-1.geo.json
	reproject \
		--use-spatialreference \
		--from 'EPSG:27700' \
		--to 'EPSG:4326' \
		london-1.geo.json \
		> london-2.geo.json

london-3.geo.json: london-2.geo.json
	geoproject 'd3.geoRobinson().fitSize([1000, 800], d)' \
		london-2.geo.json \
		> london-3.geo.json

london-4.ndjson: london-3.geo.json
	ndjson-split 'd.features' \
		< london-3.geo.json \
		> london-4.ndjson

london-5.ndjson: london-4.ndjson
	ndjson-join \
		'd.properties.GSS_CODE' \
		'd.Code' \
		london-4.ndjson \
		income-of-tax-payers.ndjson \
		> london-5.ndjson

london-6.ndjson: london-5.ndjson
	ndjson-map \
		'd[0].properties = { code: d[0].properties.GSS_CODE, name: d[0].properties.NAME, incomeMedian: d[1]["Median � - 2013-14"] }, d[0]' \
		< london-5.ndjson \
		> london-6.ndjson

london-7.topo.json: london-6.ndjson
	geo2topo \
        --newline-delimited \
		'boroughs=london-6.ndjson' \
		> london-7.topo.json

london-8.topo.json: london-7.topo.json
	toposimplify \
		--planar-area 2 \
		london-7.topo.json \
		> london-8.topo.json

london-9.topo.json: london-8.topo.json
	topoquantize 1e3 \
		london-8.topo.json \
		> london-9.topo.json

clean:
	rm -f \
		london-1.geo.json \
		london-2.geo.json \
		london-3.geo.json \
		london-4.ndjson \
		london-5.ndjson \
		london-6.ndjson \
		london-7.topo.json \
		london-8.topo.json \
		london-9.topo.json
