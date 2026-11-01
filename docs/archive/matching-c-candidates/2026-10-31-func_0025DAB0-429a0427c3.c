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
    Func0025DAB0Input *view = (Func0025DAB0Input *)input;
    g_func_0025DAB0_value_0F68 = value;
    g_func_0025DAB0_value_0F70 = view->value_00;
    g_func_0025DAB0_value_0F72 = view->value_02;
    g_func_0025DAB0_value_0F74 = view->value_04 | 0x10;
    func_00262AB0(func_0025D8D4);
}
