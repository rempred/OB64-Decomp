#include "overlays/descriptor_18_script_records.h"

void func_001BD378(u8 *p, u16 mask, u8 v) {
    u16 bit = 1;
    u32 i;
    u8 *q;
    while (mask != 0) {
        if (mask & bit) {
            for (i = 0; i < 16; i++) {
                if ((*(u16 *)((u8 *)(p) + (0x12 + i * 6))) & bit) {
                    break;
                }
            }
            if (i >= 16) {
                for (i = 0; i < 16; i++) {
                    if ((*(u16 *)((u8 *)(p) + (0x12 + i * 6))) == 0) {
                        break;
                    }
                }
                if (i >= 16) {
                    for (;;);
                }
            }
            mask ^= bit;
            q = p + i * 6;
            (*(u16 *)((u8 *)(q) + (0x12))) = bit;
            q[0x14] = 0;
            q[0x15] = 0;
            q[0x16] = v;
        }
        bit <<= 1;
    }
}
