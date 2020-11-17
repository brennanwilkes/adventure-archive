#!/bin/bash


filterByRegex(){
	while read line; do
		echo "$line" | grep -oE "$1" | sed -E "s/$1/\1/g"
	done
}

hash(){
	inputContent=""
	while read line; do
		inputContent="${inputContent}${line}"
	done
	echo "$inputContent" | shasum | sed 's/[ -]*$//g'
}

outputDelim="<>DELIM<>"
rmDelim(){
	while read line; do
		echo "$line" | sed "s/$outputDelim//g"
	done
}

delimOutput(){
	output=""
	for thing in "$@"; do
		thing=$( echo "$thing" | rmDelim )
		output="${output}${thing}${outputDelim}"
	done
	output=$( echo -n "$output" | sed "s/$outputDelim\$//" )
	echo "$output"
}

threadData="$1"

rootURL=$( echo $threadData | cut -d',' -f1 )
subforum=$( echo $threadData | cut -d',' -f2 | cut -d'/' -f1 )
thread=$( echo $threadData | cut -d',' -f3 | rev | cut -d'/' -f1 | rev )


countryEx=$( echo $threadData | cut -d',' -f2 | rev | cut -d'/' -f1 | rev )
forumName=$( echo $threadData | cut -d',' -f4 | sed 's/&amp;/and/g' )
fullURL=${rootURL}${subforum}/topics/${thread}/compact?

threadID=$( echo "${thread}${fullURL}" | hash )

pageData=$( curl -Ls $fullURL )
pageTitle=$( echo $pageData | filterByRegex '<h1 class=\"topic__title copy--h1\">([^<]+)<\/h1>' | sed 's/&amp;/and/g' )
countryName=$( echo "$pageData" | filterByRegex '<small class=\"breadcrumbs\">([^<]+)<' | rev | cut -d'/' -f1 | rev | sed 's/&amp;/and/g' )

#https://www.lonelyplanet.com/thorntree/forums/africa/topics/africa-branch-faq/compact?
##Posts
while IFS= read -r post; do
	post=$( echo $post | tr '^' '\n' )

	user=$( echo $post | filterByRegex 'post__info__username\">([^<]+)<\/presenter>' )
	userId=$( echo "$user" | hash )
	time=$( echo $post | filterByRegex '<small class=\"timeago\">([^<]+)<\/small>' | xargs )
	content=$( echo $post | grep -oP '(?<=<td class=\"post__text\"><p>).*?(?=<\/p><\/td>)' )
	contentStripped=$( echo $content | sed -E 's/<\/?(a|br|strong|em|light|weak|i|b|li|ul|ol|p|u|presenter)[^>]*>//g' )
	commentId=$( echo "${userId}${time}${pageTitle}" | hash )

	position=$( echo $post | filterByRegex '<td class=\"post__position\">([^<]*)<\/td>')
	[ -z "$position" ] && position="0"
	position=$( echo $position )

	delimOutput "$forumName" "$countryName" "$pageTitle" "$threadID" "$commentId" "$userId" "$user" "$time" "$position" "$contentStripped"

done <<<$(echo $pageData | tr -d '^' | tr '\n' '^' | grep -oP '(?<=<tr class=\"post\">).*?(?=<\/tr>)')

exit 0
