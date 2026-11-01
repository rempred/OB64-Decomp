#include "common/types.h"

typedef struct Func0025DAB0Input {
    u16 value_00, value_02;
    u8 value_04;
} Func0025DAB0Input;
extern volatile u8 g_func_0025DAB0_value_0F68;
extern volatile u16 g_func_0025DAB0_value_0F70;
extern volatile u16 g_func_0025DAB0_value_0F72;
extern volatile u8 g_func_0025DAB0_value_0F74;
extern s32 func_0025D8D4(u16, void *);
extern void *func_00262AB0(void *);

void func_0025DAB0(u8 value, const Func0025DAB0Input *input)
{
    /* This access view retains both halfword load/store pairs in KMC. */
    volatile u16 *halfwords = (volatile u16 *)input;
    g_func_0025DAB0_value_0F68 = value;
    g_func_0025DAB0_value_0F70 = halfwords[0];
    g_func_0025DAB0_value_0F72 = halfwords[1];
    g_func_0025DAB0_value_0F74 = ((u8 *)halfwords)[4] | 0x10;
    func_00262AB0(func_0025D8D4);
}
