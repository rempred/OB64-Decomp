#include "game/sound_channel_table.h"
#include "game/sound_channel.h"
#include "game/sound_channel_services.h"
typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_8022A974;
s32 func_00011f08(s32);

void D_800EA6C8(SoundChannel *);
void D_800EA714(void);
void D_801C5938(s32 a, s32 b);
extern s16 D_8022A994;
void func_0028308C(s32 arg0, s32 arg1, s32 arg2) {
    if (arg0 == 7) {
        if (arg1 == 1) {
            D_800EA714();
        }
    } else {
        if (arg1 == 0) {
            if (arg0 < 3) {
                if (func_00011f08((*(s32 *)((u8 *)(D_8022A8A8[arg0]) + (0x24)))) != 0) {
                    (*(s8 *)((u8 *)(&D_8022A974[arg0]) + (0x1CB2))) = arg2;
                    D_800EA6C8(D_8022A8A8[arg0]);
                    return;
                }
            }
            if (D_8022A994 == 0) {
                D_800EA6B0(D_8022A8A8[arg0], arg2, 5);
                return;
            }
            D_801C5938((s32)D_8022A8A8[arg0], arg2);
            return;
        }
        if (arg1 == 1) {
            D_800EA6C8(D_8022A8A8[arg0]);
            return;
        }
        if (arg0 != 5) {
            D_800EA6B0(D_8022A8A8[arg0], arg2, 0xA);
            return;
        }
        D_800EA604(D_8022A8BC, arg2);
    }
}
