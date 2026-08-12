	.text
	mtc1	$0,$f31
	mfc1	$31,$f0
	mtc1	$4,$f12	# ordinary int-to-float compiler transfer
	cvt.s.w	$f12,$f12
