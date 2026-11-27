#include "game/class_field_lookups.h"
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} Stock6D3;
extern Stock6D3 D_80196B00[];
typedef struct {
    u8 b[0x38];
} Char6D3;
extern Char6D3 D_80193BC0_copy[];
int D_8016B6FC(int);
void func_0006d634(u8 *src, s32 n);
extern inline u16 FreeStock6D3(void) {
    s32 i;
    for (i = 0; i < 0x116; i++) {
        if (D_80196B00[i].id == 0) {
            return i;
        }
    }
    return 0x1FF;
}
void func_0006d634(u8 *src, s32 n) {
    s32 i;
    s32 j;
    for (i = 0; i < n; i++) {
        D_80196B00[i].id = *(u16 *)(src + i * 4);
        D_80196B00[i].count = (src + i * 4)[2];
    }
    for (i = 0; i < 100; i++) {
        u8 cls = D_80193BC0_copy[i].b[0x11];
        u8 base = D_80193BC0_copy[i].b[0x12];
        if (cls == 0) {
            continue;
        }
        for (j = 0; j < 4; j++) {
            u16 id = g_func_0018B494_equipment_selectors[j](cls, base);
            u16 s;
            if (id == 0) {
                continue;
            }
            s = D_8016B6FC(id);
            if (s == 0x1FF) {
                s = FreeStock6D3();
            }
            D_80196B00[s].id = id;
            D_80196B00[s].equipped++;
            D_80196B00[s].count++;
        }
    }
}
