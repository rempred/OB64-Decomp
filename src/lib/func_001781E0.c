#include "game/panel_constructor.h"
extern Panel *D_80218D80;
extern void *D_80218D84;
extern u8 D_80193BD1[][0x38];
extern u16 *D_8021CA70;
void *D_8016FBE0(u8, u8, u16 **);
void func_00177F00(Panel *, s32);
typedef struct {
    u8 pad0[0x18];
    s16 alpha[5];
    s8 id;
    u8 pad23[0x2C - 0x23];
    s32 x;
    s32 y;
} Win177;
void func_00177F00(Panel *, s32);
void func_001781E0(s32 id) {
    D_80218D84 = D_8016FBE0(D_80193BD1[(u8)id][0], 0, &D_8021CA70);
    D_80218D80 = D_8017BFB0(0, 0, func_00177F00, 0x9C, 0x9C, 0xA4, 0xA4, 0x44, 0x82, 0xFC, 0xBE);
    D_80218D80->field22 = id;
}
