#include "common/types.h"
#include "game/sound_channel_services.h"
extern u16 D_800E8100;
extern u16 D_800E8700;
extern s8 D_8019C90C;
extern u8 *D_8019C910;
extern u16 D_8019C906;
extern SoundChannel D_800EB1F0;
typedef struct {
    s32 se[4];
} Sounds699;
extern Sounds699 D_8019C780;
s32 func_0006ae20(s32 noCancel) {
    s32 r = -1;
    s32 snd = 0;
    if (D_800E8100 & 0x8000) {
        r = D_8019C910[D_8019C90C];
        snd = 3;
    } else if (noCancel == 0 && (D_800E8100 & 0x4000)) {
        r = -2;
        snd = 2;
    } else if (D_800E8700 & 0x800) {
        s8 *c = &D_8019C90C;
        if (--*c < 0) {
            *c = D_8019C906 - 1;
        }
        snd = 1;
    } else if (D_800E8700 & 0x400) {
        s8 *c = &D_8019C90C;
        if (++*c > D_8019C906 - 1) {
            *c = 0;
        }
        snd = 1;
    }
    if (snd != 0) {
        Sounds699 t = D_8019C780;
        D_800EA604(&D_800EB1F0, t.se[snd]);
    }
    return r;
}
