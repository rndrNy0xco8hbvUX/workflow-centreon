#! /usr/bin/perl -w
###################################################################
# Oreon is developped with GPL Licence 2.0 
#
# GPL License: http://www.gnu.org/licenses/gpl.txt
#
# Developped by : Julien Mathis - jmathis@merethis.com
#
###################################################################
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
#    For information : contact@merethis.com
####################################################################
#
# Script init
#

#use strict;
#use warnings;
use DBI;
use POSIX qw(mkfifo);
use threads;
use threads::shared;
use RRDs;
use File::Copy;

my $installedPath = "/srv/oreon/ODS/";

my $LOG = $installedPath."var/ods.log";
my $PID = $installedPath."var/ods.pid";

# Init Globals
use vars qw($debug $mysql_user $mysql_passwd $mysql_host $mysql_database_oreon $mysql_database_ods $LOG %status $generalcounter);

$debug = 0;

# Init value
my ($file, $line, @line_tab, @data_service, $hostname, $service_desc, $metric_id, $configuration);
%status = ('OK' => '0', 'WARNING' => '1', 'CRITICAL' => '2', 'UNKNOWN' => '3', 'PENDING' => '4');

require $installedPath."etc/conf.pm";

sub catch_zap {
	writeLogFile($LOG, "Somebody sent me a kill signal...\n");
	writeLogFile($LOG, "Stopping ODS engine...\n");
	exit();
}

sub sigsegv(){
	writeLogFile($LOG, " Oups a Segmentation Fault....\n");
}

sub writeLogFile($){
	open (LOG, ">> ".$LOG) || print "can't write $LOG: $!";
	print LOG time()." - ".$_[0];
	close LOG or warn $!;
}

# Starting ODS Engine
writeLogFile("Starting ODS engine...\n");
writeLogFile("PID : ".$$."\n");

# checking if pid file exists.
if (-x $PID){
	writeLogFile("ods already runnig. can't launch again....\n");
	exit(2);
}

# Writing PID
open (PID, ">> ".$PID) || print "can't write PID : $!";
print PID $$ ;
close PID or warn $!;

# Set signals
$SIG{INT} = \&catch_zap;
$SIG{SEGV} = 'sigsegv';

require $installedPath."lib/misc.pm";
require $installedPath."lib/purge.pm";
require $installedPath."lib/getPerfData.pm";
require $installedPath."lib/getHostData.pm";
require $installedPath."lib/getServiceData.pm";
require $installedPath."lib/indentifyService.pm";
require $installedPath."lib/verifyHostServiceIdName.pm";
require $installedPath."lib/identifyMetric.pm";
require $installedPath."lib/updateFunctions.pm";

my $thread_perfdata 		= threads->new("GetPerfData");
my $thread_check_restart	= threads->new("CheckRestart");

$thread_perfdata->join;
$thread_check_restart->join;
writeLogFile("Stopping ODS engine...\n");
if (!unlink($PID)){writeLogFile("Error When removing pid file : $!");}
exit(1);