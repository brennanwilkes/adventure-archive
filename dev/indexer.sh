#!/bin/bash

filterByRegex(){
	while read line; do
		echo "$line" | grep -oE "$1" | sed -E "s/$1/\1/g"
	done
}


webpage="https://www.lonelyplanet.com/thorntree/forums/"
indexDate=$( curl -Ls $webpage )
forums=$( echo $indexDate | filterByRegex 'href="\/thorntree\/forums\/([^>%]+)">' )
#echo $forums

for page in $forums; do
	pageData=$( curl -Ls ${webpage}$page )
	name=$( echo $pageData | filterByRegex '<h1 class="copy--h1">([^>]+)<\/h1>' | sed 's/&amp;/and/g' )
	numPages=$( echo $pageData | grep -oE 'pagination__link pagination__link--last[^<]*' | head -n1 | rev | cut -d'>' -f1 | rev )
	echo $name $numPages
done;
