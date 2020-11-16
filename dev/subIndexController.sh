#!/bin/bash

while IFS= read -r page; do
	echo "$page" | ./dev/subforumIndex.sh  | xargs -n1 -P256 ./dev/threadIndex.sh
done;

exit 0
