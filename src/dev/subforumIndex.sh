#!/bin/bash

rootData="$1"

rootPage=$( echo $rootData | cut -d',' -f1 )
forum=$( echo $rootData | cut -d',' -f2 )
forumEscaped=$( echo $forum | sed 's/\//\\\//g' )
rootName=$( echo $rootData | cut -d',' -f3 )
numPages=$( echo $rootData | cut -d',' -f4 )

for page in $(seq $numPages); do

	threads=$( curl -Ls "${rootPage}${forum}?page=${page}" | grep -o 'href="[^"]*"' | grep -v '[#?:]' | sed -n -e "s/^.*href=\"\/thorntree\/forums\/$forumEscaped\///p" | sed 's/"//g' | grep -v '^topics/new$' )
	for path in $threads; do
		echo "${rootPage},${forum},${path},${rootName}"
	done;
done;

exit 0
