	.file	1 "src/lib/memset_0002cd70.c"

 # GNU C 2.7.2 [AL 1.1, MM 40] GNU MIPS/ELF compiled by CC

 # Cc1 defaults:
 # -mgas

 # Cc1 arguments (-G value = 0, Cpu = 4000, ISA = 3):
 # -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G -fno-PIC -mno-abicalls -fno-builtin
 # -funsigned-char -o

	.version	"01.01"
gcc2_compiled.:
 #APP
	.set noreorder
 #NO_APP
	.text
	.align	2
	.globl	func_0002CD70
	.type	 func_0002CD70,@function
	.ent	func_0002CD70
func_0002CD70:
	.frame	$sp,0,$31		# vars= 0, regs= 0/0, args= 0, extra= 0
	.mask	0x00000000,0
	.fmask	0x00000000,0
 #APP
	or $3,$6,$0
 #NO_APP
	move	$2,$4
 #APP
 #NO_APP
	beq	$6,$0,.L2
 #APP
	addiu $6,$6,-1
1:
or $3,$6,$0
sb $5,0($2)
addiu $2,$2,1
bne $6,$0,1b
addiu $6,$6,-1

 #NO_APP
.L2:
	.set	noreorder
	.set	nomacro
	j	$31
	move	$2,$4
	.set	macro
	.set	reorder

	.end	func_0002CD70
.Lfe1:
	.size	 func_0002CD70,.Lfe1-func_0002CD70
 #APP
	.align 4
.size func_0002CD70,48

	.ident	"GCC: (GNU) 2.7.2"
