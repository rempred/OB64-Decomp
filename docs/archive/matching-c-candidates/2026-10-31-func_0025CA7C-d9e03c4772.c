#include "common/types.h"
extern u32 func_0024BCA0(u32);

extern volatile u8 e09_byte_80220F68;
extern volatile u8 e09_byte_80220F69;
extern volatile u8 e09_byte_80220F6A;
extern s32 func_0025C8D0(u16, void *);
extern void *func_00262AB0(void *);

void func_0025CA7C(u32 value, u8 *input)
{
    if ((s16)func_0024BCA0(value & 255) == 0) {
        e09_byte_80220F68 = value;
        e09_byte_80220F69 = input[0];
        e09_byte_80220F6A = input[1] - input[0];
        func_00262AB0(func_0025C8D0);
    }
}
