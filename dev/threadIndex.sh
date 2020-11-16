#!/bin/bash

filterByRegex(){
	while read line; do
		echo "$line" | grep -oE "$1" | sed -E "s/$1/\1/g"
	done
}

execMongo(){
	mongo --quiet "mongodb+srv://cluster0.vwlck.mongodb.net/adventure-archive" --username brennan-cli -p DKdg40fjPyDzlnbk --eval "$1" | grep -v '^20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9] I NETWORK'
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

mongoUserQuery="db.users.bulkWrite(["

#https://www.lonelyplanet.com/thorntree/forums/africa/topics/africa-branch-faq/compact?
##Posts
 while IFS= read -r post; do
	post=$( echo $post | tr '^' '\n' )
	user=$( echo $post | filterByRegex 'post__info__username\">([^<]+)<\/presenter>' )
	userId=$( echo "$user" | shasum | sed 's/[ -]*$//g' )
	time=$( echo $post | filterByRegex '<small class=\"timeago\">([^<]+)<\/small>')
	content=$( echo $post | grep -oP '(?<=<td class=\"post__text\"><p>).*?(?=<\/p><\/td>)' )
	contentStripped=$( echo $content | sed 's/<[^>]*>//g' )

	position=$( echo $post | filterByRegex '<td class=\"post__position\">([^<]*)<\/td>')
	[ -z "$position" ] && position="0"

	#echo "$user"
	#echo "$time"
	#echo "$content"

	mongoUserQuery="${mongoQuery}{updateOne:{filter:{_id:0x$userId},update:{name:\"$user\"},upsert: true}},"

	#echo $user $time $position
done <<<$(echo $pageData | tr -d '^' | tr '\n' '^' | grep -oP '(?<=<tr class=\"post\">).*?(?=<\/tr>)')


mongoUserQuery=$( echo "$mongoUserQuery" | rev | cut -c2- | rev )
mongoUserQuery=${mongoUserQuery}"])"
execMongo "$mongoUserQuery"


exit 0
