#!/usr/bin/env bash
mkdir -p dists
for version in 2.18 3.0 3.1 3.2 3.3 3.4 3.5 3.6 3.7 3.8 3.9 3.10 3.11 3.12 3.13 3.14 3.15 3.16 3.17 3.18
do
	yarn add --dev ember-source@$version
	yarn ember build --environment production --output-path dists/emberobserver$version/
done
