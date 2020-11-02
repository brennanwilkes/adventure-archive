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

#echo "$fullURL"

pageData=$( curl -Ls $fullURL )
pageTitle=$( echo $pageData | filterByRegex '<h1 class=\"topic__title copy--h1\">([^<]+)<\/h1>' )

##Posts
echo $pageData | tr -d '^' | tr '\n' '^' | grep -oP '(?<=<tr class=\"post\">).*?(?=<\/tr>)' | while IFS= read -r post; do
	post=$( echo $post | tr '^' '\n' )
	user=$( echo $post | filterByRegex 'post__info__username\">([^<]+)<\/presenter>' )
	time=$( echo $post | filterByRegex '<small class=\"timeago\">([^<]+)<\/small>')
	content=$( echo $post | grep -oP '(?<=<td class=\"post__text\"><p>).*?(?=<\/p><\/td>)' )
	position=$( echo $post | filterByRegex '<td class=\"post__position\">([^<]*)<\/td>')
	[ -z "$position" ] && position="0"

	echo $user $time $position
done;


exit 0
