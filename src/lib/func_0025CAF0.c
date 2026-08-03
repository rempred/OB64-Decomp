typedef unsigned int u32;
typedef unsigned char u8;

extern u32 func_0024BCA0(u32 value);
extern void func_0020DF00(const void *message);

extern volatile u8 g_func_0025CAF0_value_68;
extern volatile u8 g_func_0025CAF0_value_70;
extern volatile u8 g_func_0025CAF0_value_71;
extern unsigned char g_func_0025CAF0_message[];

void func_0025CAF0(u32 value, u32 value_70, u32 value_71)
{
    register u32 zero asm("$0");
    register u32 saved_value_70 asm("$18") = value_70 + zero;
    register u32 saved_value_71 asm("$17") = value_71 + zero;
    register u32 saved_value asm("$16") = value + zero;

    asm volatile ("" : : "r"(saved_value_70), "r"(saved_value_71), "r"(saved_value));
    if ((func_0024BCA0(saved_value & 0xFF) << 16) != 0) {
        return;
    }

    asm volatile (
        ".set noreorder\n"
        "lui $4,0x8021\n"
        "addiu $4,$4,0x8F90\n"
        "sb $16,g_func_0025CAF0_value_68\n"
        "sb $17,g_func_0025CAF0_value_71\n"
        "lui $1,%%hi(g_func_0025CAF0_value_70)\n"
        "jal func_0020DF00\n"
        "sb $18,%%lo(g_func_0025CAF0_value_70)($1)\n"
        ".set reorder"
        :
        :
        : "memory");
}

asm(".size func_0025CAF0, 112");
