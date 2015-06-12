#!/usr/bin/perl

local ($buffer, @pairs, $pair, $name, $value, %FORM);
$ENV{'REQUEST_METHOD'} =~ tr/a-z/A-Z/;
if ($ENV{'REQUEST_METHOD'} eq "GET") {
	$buffer = $ENV{'QUERY_STRING'};
}

# split the GET into name/val pairs
@pairs = split(/&/, $buffer);
foreach $pair (@pairs) {
	($name, $value) = split(/=/, $pair);
	$value =~ tr/+/ /;
	$value =~ s/%(..)/pack("C", hex($1))/eg;
	$FORM{$name} = $value;
}

# compute the result
$cgiCallDivOne = $FORM{cgiCallDivOne};
$cgiCallDivTwo  = $FORM{cgiCallDivTwo};
$cgiResult = $cgiCallDivOne / $cgiCallDivTwo;

# generate the html
print "Content-type:text/html\r\n\r\n";
print "<html>";
print "<head>";
print "<title>Hello - Second CGI Program</title>";
print "</head>";
print "<body style=\"background-color: #454545;color: white;text-shadow: 2px 2px #000000;\"><center>";
print "<p>The result of dividing $cgiCallDivOne by $cgiCallDivTwo is: </p>";
print "<h1>$cgiResult</h1>";
print "</center></body>";
print "</html>";

1;