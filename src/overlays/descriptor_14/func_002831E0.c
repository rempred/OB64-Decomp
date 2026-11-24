#include "game/sound_channel_table.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern SoundChannel D_800EB0B0;
void D_800EA838(SoundChannel *p, s32 gain);
void D_800EA884(SoundChannel *p, s32 gain);
void func_002831E0(s32 i, s32 gain) {
    if (i == 7) {
        D_800EA838(&D_800EB0B0, gain);
    } else {
        D_800EA884(D_8022A8A8[i], gain);
    }
}
