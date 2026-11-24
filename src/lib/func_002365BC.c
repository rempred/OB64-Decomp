typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
typedef struct BattleUnit {
    struct BattleObj *obj;
    u8 unk04[0x1C];
    u16 hp;
    u16 maxHp;
    u16 str;
    u16 vit;
    u16 agi;
    u16 unk2A;
    u16 intel;
    u16 dex;
    u8 unk30;
    u8 unk31[2];
    u8 unk33;
    u8 unk34[2];
    u16 items[4];
    u8 unk3E;
    u8 unk3F;
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    s32 unk50;
    s32 lane;
    s32 unk58;
    u8 unk5C[0xC];
    s32 target;
    s32 actsUsed;
    s32 actsMax;
    u8 unk74[4];
    u8 actionKind;
    u8 unk79[3];
    s32 attack;
    s32 unk80;
    u8 unk84[0x10];
    s32 unk94;
    u8 unk98[0x60];
} BattleUnit;
s32 D_801C8B84(BattleUnit *u);
s32 D_801C8E64(BattleUnit *u);
s32 D_801C8E80(BattleUnit *u);
s32 D_801C8E9C(BattleUnit *u);
s32 D_801C8B68(BattleUnit *u);
s8 D_8016F644(u16 id);
extern inline s8 ItemBonus644(u16 id) { return id != 0 ? D_8016F644(id) : 0; }
extern inline s16 BattleUnitItemSum644(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus644(u->items[0]); if (u->items[1] != 0) { s += D_8016F644(u->items[1]); } if (u->items[2] != 0) { s += D_8016F644(u->items[2]); } return u->items[3] != 0 ? s + D_8016F644(u->items[3]) : s; }
s32 D_801C8C74(BattleUnit *u);
s32 D_801C8C74(BattleUnit *u);
s32 D_8016FEF4(s32 id);
s32 func_002365BC(BattleUnit *a, BattleUnit *b, s32 num, s32 den) {
    s32 p;
    s32 da;
    if (D_801C8E9C(b) != 0 || D_801C8E80(b) != 0 || D_801C8E64(b) != 0) {
        return 100;
    }
    if (D_801C8C74(b) != 0) {
        return 100;
    }
    da = a->unk30 + BattleUnitItemSum644(a);
    p = (f32)num / (f32)den * (f32)(da - (b->unk30 + BattleUnitItemSum644(b)) + 100);
    if (D_801C8B84(a) != 0) {
        p += 10;
    }
    if (p < 0) {
        p = 0;
    }
    if (p > 100) {
        p = 100;
    }
    if (D_8016FEF4(0xB2) != 0 && D_801C8B84(a) != 0) {
        return 100;
    }
    if (D_8016FEF4(0xB2) != 0) {
        if (D_801C8B68(a) != 0) {
            return 0;
        }
    }
    return p;
}
