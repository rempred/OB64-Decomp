#include "game/sound_channel_services.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

s32 D_800EA924(SoundChannel *ch, s32 a, u16 b, s32 c);
extern SoundChannel D_800EB1F0;
extern SoundChannel D_800EB240;
extern SoundChannel D_800EB290;
static void func_0003FC40(SoundChannel *ch, s32 id, s32 fade);
void func_0003fb94(SoundChannel *ch, s32 id) {
    if (ch == &D_800EB1F0 || ch == &D_800EB240 || ch == ((void *)0)) {
        D_800EA924(ch, 1, id, 0x4000);
    } else if (ch == &D_800EB290) {
        D_800EA924(ch, 2, 0, 0x4000);
        D_800EA924(ch, 1, id, 0x4000);
    } else {
        ch->request = id + 1;
        ch->fade = 4;
        ch->pending = 1;
    }
}
static void func_0003FC40(SoundChannel *ch, s32 id, s32 fade) {
    ch->request = id + 1;
    ch->fade = fade;
    ch->pending = 1;
}
