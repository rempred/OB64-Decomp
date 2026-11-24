#include "game/boot_state_slot_callbacks.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern s16 D_8021AFB0;
extern u8 D_8021AFB2;
extern s8 D_8021AFB3;
extern u8 D_8021AFB4;
extern u8 D_80214E84;
int func_0000735C(unsigned short, void *, short, short, unsigned short, unsigned short, unsigned short);
void func_00171F1C(int slot);
void func_00171EA0(s16 a, u8 b, u8 c, u8 d) {
    D_8021AFB0 = a;
    D_8021AFB2 = b;
    D_8021AFB3 = c;
    D_8021AFB4 = d;
    func_0000735C(0xC000, func_00171F1C, 0x66, 0x41, 0x70, 0x4B, 0xC8);
    D_80214E84 = 1;
}
void func_00171F1C(int slot);
