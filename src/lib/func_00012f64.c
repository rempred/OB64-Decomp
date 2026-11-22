#include "common/mus_voice.h"
#include "common/mus_channel.h"

extern u16 D_800B181C;
extern u16 D_800B181E;
extern s32 D_800B1818;
void func_00012f64(MusChannel *cp, s32 voice);

void func_00012f64(MusChannel *cp, s32 voice) {
    u32 v;
    v = (u32)(cp->unkBC * cp->unkC4 * cp->unkBB * cp->unk9E) >> 13;
    if (v > 0x7FFF) {
        v = 0x7FFF;
    }
    v *= (cp->unk78 == 0) ? D_800B181E : D_800B181C;
    v >>= 15;
    if (cp->unk10 != -1) {
        v = (v * cp->unk10) / (u32)cp->unk1C;
    }
    if (v != cp->unkA0) {
        cp->unkA0 = v;
        func_00018810(&D_800B1808[voice], v, D_800B1818);
    }
    v = ((cp->unkBD * cp->unkB0) >> 7) & 0x7F;
    if (v != cp->unkBE) {
        cp->unkBE = v;
        func_000186e0(&D_800B1808[voice], v);
    }
}
