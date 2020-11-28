#!/bin/bash

rootData="$1"

export rootPage=$( echo $rootData | cut -d',' -f1 )
export forum=$( echo $rootData | cut -d',' -f2 )
export forumEscaped=$( echo $forum | sed 's/\//\\\//g' )
export rootName=$( echo $rootData | cut -d',' -f3 )
export numPages=$( echo $rootData | cut -d',' -f4 )
export numPagesParts=$(( $numPages / 20 ))

handlePage(){
	page="$1"

	if (( (( ${page} % ${numPagesParts} )) == 0 ))
	then
		echo "Indexing page ${page}/${numPages}" >&2
	fi

	threads=$( curl -Ls "${rootPage}${forum}?page=${page}" | grep -o 'href="[^"]*"' | grep -v '[#?:]' | sed -n -e "s/^.*href=\"\/thorntree\/forums\/$forumEscaped\///p" | sed 's/"//g' | grep -v '^topics/new$' )
	for path in $threads; do
		echo "${rootPage},${forum},${path},${rootName}"
	done;
}

export -f handlePage


#for page in $(seq $numPages); do
#	handlePage "$page"
#done;

seq $numPages | xargs -n1 -P10 -I {} bash -c 'handlePage "$@"' _ {}

exit 0
