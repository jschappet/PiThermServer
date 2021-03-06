#!/usr/bin/perl

use Time::Piece;

@FILES = glob "/sys/bus/w1/devices/*/w1_slave";

open(OUTSIDE, ">/root/therm.now.json");
$t = Time::Piece->new;
$time = $t->epoch;
foreach (@FILES) {

	$fileName=$_;
	open(T1, $fileName);
	my($devName) = $fileName =~ m%/sys/bus/w1/devices/(.*)/w1_slave%;
	while(<T1>) {
		if (/t=([\d|-]*)$/) {
			$cTemp = sprintf("%.2f", $1 / 1000);
			print ",{\"temperature_record\":[{\"unix_time\":".$time.
				",\"celsius\":$cTemp,\"device\":\"".$devName."\"}]}\n";
			if ($devName =~ /00080293b007/) {
				print OUTSIDE "{\"temperature_record\":[{\"unix_time\":".$time.
					",\"celsius\":$cTemp,\"device\":\"".$devName."\"}]}\n";
			}
		}
	}
	close T1;

}
close OUTSIDE;

