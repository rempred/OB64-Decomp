#include "common/types.h"

extern u32 D_80220210[];
extern u16 D_80220D40;
extern void *D_80220D44;
extern s32 D_80220D48;
extern void **D_80220F20;
extern u32 func_8009DAF4(u32 key);
extern void *func_8009DBB8(void *dest, u32 key);

void func_00260E00(u16 code, s32 index)
{
    u32 key;
    s32 size;

    if (index > 0) {
        key = D_80220210[code];
        if (key != 0) {
            if ((D_80220D40 != code) || ((u32)D_80220D44 != key) ||
                (D_80220D48 != index)) {
                size = (s32)func_8009DAF4(key);
                if (index >= size / 4) {
                    /* Preserve the separate retail failure loops. */
                    for (;;) {
                    }
                }
                if ((size == 0) | (size > 0x7FFF)) {
                    for (;;) {
                    }
                }
                func_8009DBB8(D_80220F20, key);
                size = (s32)func_8009DAF4((u32)D_80220F20[index]);
                if ((size == 0) | (size > 0x7FFF)) {
                    for (;;) {
                    }
                }
                func_8009DBB8(D_80220F20, (u32)D_80220F20[index]);
                return;
            }
            return;
        }
    }
    for (;;) {
    }
}
