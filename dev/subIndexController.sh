#!/bin/bash


while IFS= read -r page; do
	output=$( echo $page | cut -d',' -f3 | tr ' ' '-' )
	echo "$page" | ./dev/subforumIndex.sh > "./data/${output}-threads.csv"
done;
