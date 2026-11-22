#include "game/class_field_lookups.h"
typedef struct {
    u8 unk00[0x36];
    u16 items[4];
    u8 unk3E[2];
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    u8 unk50[4];
    s32 unk54;
    s32 unk58;
    u8 unk5C[0x14];
    s32 actsMax;
} BattleUnit;
u8 func_0020D434(s32 idx);
void func_0020CB64(BattleUnit *u, BattleUnit *t) {
    u32 f;
    if (t != ((void *)0)) {
        if (u != t) {
            if (t->cls == 33) {
                f = t->flags;
                if (!(f & 1)) {
                    if (!((f >> 1) & 1)) {
                        u->actsMax = (u8)D_8016E338((u8)u->unk48, (u8)u->cls, func_0020D434(u->unk58)) + 1;
                    }
                }
            }
        }
    }
}
u8 func_0020D434(s32 idx);
