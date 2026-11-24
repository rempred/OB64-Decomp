#include "game/task27_object.h"
#include "game/sound_channel_services.h"

extern u16 D_800E9BE4[];
extern u8 D_800EB1F0[];

extern s16 D_8022CB28;
extern s16 D_8022CB2A;
extern u16 D_800E79B0;
void D_8017C384(struct Panel *);
extern inline s16 ShopYesNo27(void) {
    if (D_800E79B0 & 0x8000) {
        return D_8022CB2A;
    }
    if (D_800E79B0 & 0x4000) {
        return 0;
    }
    if (D_800E9BE4[0] & 0x800) {
        if (D_8022CB2A != 1) {
            D_800EA604((SoundChannel *)D_800EB1F0, 2);
        }
        D_8022CB2A = 1;
    } else if (D_800E9BE4[0] & 0x400) {
        if (D_8022CB2A != 0) {
            D_800EA604((SoundChannel *)D_800EB1F0, 2);
        }
        D_8022CB2A = 0;
    }
    return -1;
}
s32 func_0027F968(void) {
    Obj27 *o = D_8022CB20;
    u8 *sub = (u8 *)&o->w18;
    s16 r;
    if (o->w24 == ((void *)0)) {
        return 0;
    }
    D_8022CB28 = 2;
    if (((Panel *)o->w24)->field18 <= 200) {
        return 0;
    }
    r = ShopYesNo27();
    if (r == 1) {
        D_800EA604((SoundChannel *)D_800EB1F0, 0);
        if ((*(Panel * *)((u8 *)(sub) + (0xC))) != ((void *)0) && !(((Panel *)(*(Panel * *)((u8 *)(sub) + (0xC))))->field28 & 2)) {
            D_8017C384((*(Panel * *)((u8 *)(sub) + (0xC))));
            return 1;
        }
        return 1;
    }
    if (r == 0) {
        D_800EA604((SoundChannel *)D_800EB1F0, 1);
        if ((*(Panel * *)((u8 *)(sub) + (0xC))) != ((void *)0) && !(((Panel *)(*(Panel * *)((u8 *)(sub) + (0xC))))->field28 & 2)) {
            D_8017C384((*(Panel * *)((u8 *)(sub) + (0xC))));
            return 2;
        }
        return 2;
    }
    return 0;
}
