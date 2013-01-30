#!/usr/bin/perl

use Time::Piece;

@FILES = glob "/sys/bus/w1/devices/*/w1_slave";

foreach (@FILES) {

	$fileName=$_;
	open(T1, $fileName);
	my($devName) = $fileName =~ m%/sys/bus/w1/devices/(.*)/w1_slave%;
	$t = Time::Piece->new;
	while(<T1>) {
		if (/t=(\d*)$/) {
			$cTemp = sprintf("%.2f", $1 / 1000);
			print ",{\"temperature_record\":[{\"unix_time\":".$t->epoch.
				",\"celsius\":$cTemp,\"device\":\"".$devName."\"}]}\n";
		}
	}
	close T1;

}
