for i in $( seq $2 ); do
	curl -L -s -w 'Testing Website Response Time for :%{url_effective}\n\nLookup Time:\t\t%{time_namelookup}\nConnect Time:\t\t%{time_connect}\nPre-transfer Time:\t%{time_pretransfer}\nStart-transfer Time:\t%{time_starttransfer}\n\nTotal Time:\t\t%{time_total}\n' -o /dev/null $1 | tail -n1 | tr '\t' ' ' | tr -s '' | cut -d' ' -f4;
done | awk '{s+=$1} END {print s/'$2'}'
