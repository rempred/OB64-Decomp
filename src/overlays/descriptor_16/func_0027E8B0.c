int func_0027A0BC(int index);
#include "game/sound_channel_services.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x18];
    s32 *w18;
    s16 h1C;
    s16 h1E;
    u8 *w20;
    u8 *w24;
    s16 h28;
} Obj27;
extern u16 D_800E9BE4[];
extern u8 D_800EB1F0[];

typedef struct {
    s32 *items;
    s16 unk4;
    s16 flags;
} List27;
extern inline s16 List27_EntryMark(List27 *l, u8 *e) {
    s16 mark = 0;
    if (e == ((void *)0)) {
        return 0;
    }
    if ((l->flags & 2) && ((*(s32 *)((u8 *)(e) + (0x40))) & 2)) {
        mark = 2;
    }
    if ((l->flags & 1) && (*(u16 *)((u8 *)(e) + (0x20))) == 0) {
        mark = 1;
    }
    return mark;
}
extern u16 D_800E8100;
extern s32 D_80196A6C;
s32 func_0027E8B0(Obj27 *o) {
    List27 *l = (List27 *)&o->w18;
    s16 d = 0;
    if (--(*(s16 *)((u8 *)(o) + (0x1C))) > 0) {
        return 0;
    }
    (*(s16 *)((u8 *)(o) + (0x1C))) = 0;
    if (D_800E8100 & 0x8000) {
        return ((u32)D_80196A6C < func_0027A0BC((*(s16 *)((u8 *)(o) + (0x10))))) ? 3 : 1;
    }
    if (D_800E8100 & 0x4000) {
        return 2;
    }
    while (1) {
        if (D_800E9BE4[0] & 0x800) {
            d--;
            l->unk4 = 5;
            if ((*(s16 *)((u8 *)(o) + (0x10))) + d < 0) {
                break;
            }
        } else if (D_800E9BE4[0] & 0x400) {
            d++;
            l->unk4 = 5;
            if ((*(s16 *)((u8 *)(o) + (0x10))) + d >= 5) {
                break;
            }
        } else {
            break;
        }
        if (List27_EntryMark(l, (u8 *)l->items[(*(s16 *)((u8 *)(o) + (0x10))) + d]) != 0) {
            (*(s16 *)((u8 *)(o) + (0x10))) += d;
            D_800EA604((SoundChannel *)D_800EB1F0, 2);
            break;
        }
    }
    return 0;
}
extern s32 D_80196A6C;
