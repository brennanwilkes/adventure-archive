webpage="https://www.lonelyplanet.com/thorntree/forums/"
indexDate=$( curl -Ls $webpage )
forumRegex='href="\/thorntree\/forums\/([^>%]+)">'
forums=$( echo $indexDate | grep -oE "$forumRegex" | sed -E "s/$forumRegex/\1/g" )
echo $forums
