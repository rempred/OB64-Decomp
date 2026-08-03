typedef unsigned char u8;
typedef unsigned short u16;

typedef struct Func0025DAB0Input {
    volatile u16 value_00;
    volatile u16 value_02;
    volatile u8 value_04;
} Func0025DAB0Input;


extern volatile u8 g_func_0025DAB0_value_0F68;
extern volatile u16 g_func_0025DAB0_value_0F70;
extern volatile u16 g_func_0025DAB0_value_0F72;
extern volatile u8 g_func_0025DAB0_value_0F74;
extern unsigned char g_func_0025DAB0_fixed_argument[];
extern void func_0015F070(void *argument);

void func_0025DAB0(u8 value, const Func0025DAB0Input *input)
{
    volatile unsigned char frame_pad[16];

    g_func_0025DAB0_value_0F68 = value;
    asm volatile("" ::: "memory");
    g_func_0025DAB0_value_0F70 = input->value_00;
    asm volatile("" ::: "memory");
    g_func_0025DAB0_value_0F72 = input->value_02;
    asm volatile("" ::: "memory");
    {
        register u8 value_04 asm("$2") = input->value_04;

        asm volatile(
            ".set noat\n"
            ".set noreorder\n"
            "lui $4,%%hi(g_func_0025DAB0_fixed_argument)\n"
            "addiu $4,$4,%%lo(g_func_0025DAB0_fixed_argument)\n"
            "ori $2,$2,0x0010\n"
            "lui $1,%%hi(g_func_0025DAB0_value_0F74)\n"
            "jal func_0015F070\n"
            "sb $2,%%lo(g_func_0025DAB0_value_0F74)($1)\n"
            ".set at\n"
            ".set reorder\n"
            :
            : "r"(value_04)
            : "$1", "$2", "$4", "$31", "memory");
    }
}
