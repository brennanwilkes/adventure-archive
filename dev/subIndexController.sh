#!/bin/bash

####REMOVE head -n1 FOR FULL INDEXING
while IFS= read -r page; do
	echo "$page" | ./dev/subforumIndex.sh  | xargs -n1 -P256 ./dev/threadIndex.sh
	#echo "$page" | ./dev/subforumIndex.sh | head -n1 | ./dev/threadIndex.sh
done;

exit 0
