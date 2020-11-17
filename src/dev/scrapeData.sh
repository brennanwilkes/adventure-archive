#!/bin/bash

#Running this full command causes eventual memory leaks and crashes
#Instead, I'm modifying the scrape command periodically to download chunks at a time with restarts
#./src/dev/rootIndexer.sh | xargs -d'\\n' -n1 -P 32 ./src/dev/subforumIndex.sh | xargs -d'\\n' -n1 -P256 ./src/dev/threadIndex.sh | node ./src/dev/mongoUploadData.js

forumCache="./data/forums.csv"
cacheIndexFile="./data/cacheIndex.txt"
cacheIndex=$( cat "$cacheIndexFile" )

echo "Scraping data from from $forumCache line $cacheIndex:"
cat "$forumCache" | head -n $cacheIndex | tail -n1

cat "$forumCache" | head -n $cacheIndex | tail -n1 | xargs -d'\n' -n1 ./src/dev/subforumIndex.sh | xargs -d'\n' -n1 -P512 ./src/dev/threadIndex.sh | node --max-old-space-size=7168 ./src/dev/mongoUploadData.js

echo "Scrape completed. Incrementing cache index $cacheIndex -> $(( $cacheIndex + 1 ))"
echo $(( $cacheIndex + 1 )) > $cacheIndexFile
