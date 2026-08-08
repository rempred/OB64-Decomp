	.file	1 "src/lib/func_0025C8A4.c"

 # GNU C 2.7.2 [AL 1.1, MM 40] GNU MIPS/ELF compiled by CC

 # Cc1 defaults:
 # -mgas

 # Cc1 arguments (-G value = 0, Cpu = 4000, ISA = 3):
 # -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G -fno-PIC -mno-abicalls -fno-builtin
 # -funsigned-char -o

	.version	"01.01"
gcc2_compiled.:
	.text
	.align	2
	.globl	func_0025C8A4
	.type	 func_0025C8A4,@function
	.ent	func_0025C8A4
func_0025C8A4:
	.frame	$sp,24,$31		# vars= 0, regs= 1/0, args= 16, extra= 0
	.mask	0x80000000,-8
	.fmask	0x00000000,0
	subu	$sp,$sp,24
	sw	$4,g_func_0025C8A4_saved_arg
	la	$4,g_func_0025C8A4_message
	sw	$31,16($sp)
	jal	func_0020DF00
	lw	$31,16($sp)
	addu	$sp,$sp,24
	j	$31
	.end	func_0025C8A4
.Lfe1:
	.size	 func_0025C8A4,.Lfe1-func_0025C8A4
 #APP
	.size func_0025C8A4,44
	.ident	"GCC: (GNU) 2.7.2"
