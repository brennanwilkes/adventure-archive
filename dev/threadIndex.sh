#!/bin/bash

filterByRegex(){
	while read line; do
		echo "$line" | grep -oE "$1" | sed -E "s/$1/\1/g"
	done
}

read threadData
rootURL=$( echo $threadData | cut -d',' -f1 )
subforum=$( echo $threadData | cut -d',' -f2 | cut -d'/' -f1 )
thread=$( echo $threadData | cut -d',' -f3 | rev | cut -d'/' -f1 | rev )

countryEx=$( echo $threadData | cut -d',' -f2 | rev | cut -d'/' -f1 | rev )
forumName=$( echo $threadData | cut -d',' -f4 )
fullURL=${rootURL}${subforum}/topics/${thread}/compact?

pageData=$( curl -Ls $fullURL )
pageTitle=$( echo $pageData | filterByRegex '<h1 class=\"topic__title copy--h1\">([^<]+)<\/h1>' )
echo $pageTitle

exit 0
