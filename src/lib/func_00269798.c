asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef unsigned short u16;

extern void func_00023780(void *destination, unsigned int bytes);
extern void func_00269470(void);
extern volatile u16 g_func_00269470_flags;
extern volatile void *g_func_00269470_value_3C;

void func_00269798(void *argument)
{
    register void *saved_argument asm("$16");

    saved_argument = argument;
    func_00023780((void *)&g_func_00269470_flags, 0x18);

    asm volatile(
        ".set noreorder\n"
        ".set noat\n"
        "lui $4,%%hi(func_00269470)\n"
        "addiu $4,$4,%%lo(func_00269470)\n"
        "lui $1,%%hi(g_func_00269470_value_3C)\n"
        "jal func_0020D778\n"
        "sw $16,%%lo(g_func_00269470_value_3C)($1)\n"
        ".set at\n"
        ".set reorder\n"
        :
        : "r"(saved_argument)
        : "memory");
}
