#include "game/battle_roster_record.h"

#include "game/class_field_lookups.h"
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
u8 D_801C9FA4(s32 a);
int D_801C8B68(void *record);
s32 D_801C8BA4(void *record);
s32 D_801BE138(s32 a, s32 cls, s32 c, s32 d);
void D_801E15E0(u8 *record, s32 cls);
inline void func_0023422C(void *record, s32 cls) {
    BattleRosterRecord *u = record;
    BattleObj *o;
    s32 v;
    s32 x;
    if (u->variant4C.word == u->class48.word) {
        u->class48.word = cls;
    }
    u->variant4C.word = cls;
    u->field_36 = D_8016DF88((u8)u->class48.word, (u8)cls);
    u->field_38 = D_8016DFDC((u8)u->class48.word, (u8)cls);
    u->field_3A = D_8016E030((u8)u->class48.word, (u8)cls);
    u->field_3C = D_8016E084((u8)u->class48.word, (u8)cls);
    u->field70 = (u8)D_8016E338((u8)u->class48.word, (u8)u->variant4C.word, D_801C9FA4(u->row58));
    x = D_801C8B68(u);
    v = D_801BE138(u->class48.word, cls, x, D_801C8BA4(u));
    o = u->links[0];
    u->handle50 = v;
    o->unk44 = v;
    o->unk18 = v;
    D_801E15E0((u8 *)u, cls);
}
