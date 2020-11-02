#!/bin/bash

while IFS= read -r page; do
	echo "$page" | ./dev/subforumIndex.sh | head -n1 | ./dev/threadIndex.sh
done;

exit 0
