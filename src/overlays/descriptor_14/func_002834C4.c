#include "game/sound_channel_table.h"
#include "game/sound_channel.h"

typedef signed short s16;
typedef signed int s32;
s32 D_8016FEF4(s16 flag);
void D_800EA7E4(SoundChannel *channel, s32 gain);
void func_002834C4(s32 i, s32 v) {
    s32 k;
    s32 end;
    k = 0;
    if (D_8016FEF4(0xB5) == 1) {
        return;
    }
    if (i == 7) {
        end = 7;
    } else {
        k = i;
        end = i + 1;
    }
    for (; k < end; k++) {
        D_800EA7E4(D_8022A8A8[k], v);
    }
}
