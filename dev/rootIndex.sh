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

#	102,285 total pages
#  ~1,022,850 threads
#	0.98618s per page
#  ~11 days download time
#	0.301611s
#  ~85 hours

for page in $forums; do
	pageData=$( curl -Ls ${webpage}$page )
	name=$( echo $pageData | filterByRegex '<h1 class="copy--h1">([^>]+)<\/h1>' | sed 's/&amp;/and/g' | tr -d ',' )
	numPages=$( echo $pageData | grep -oE 'pagination__link pagination__link--last[^<]*' | head -n1 | rev | cut -d'>' -f1 | rev )
	[ ! -z "$name" ] && [ ! -z "$numPages" ] && {
		echo $webpage,$page,$name,$numPages
	}
done;

exit 0
