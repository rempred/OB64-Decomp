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
s8 D_8016F7EC(u16 id);
s8 D_8016F79C(u16 id);
extern inline s8 ItemBonus79C(u16 id) { return id != 0 ? D_8016F79C(id) : 0; }
extern inline s16 BattleUnitItemSum79C(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus79C(u->items[0]); if (u->items[1] != 0) { s += D_8016F79C(u->items[1]); } if (u->items[2] != 0) { s += D_8016F79C(u->items[2]); } return u->items[3] != 0 ? s + D_8016F79C(u->items[3]) : s; }
extern inline s8 ItemBonus7EC(u16 id) { return id != 0 ? D_8016F7EC(id) : 0; }
extern inline s16 BattleUnitItemSum7EC(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus7EC(u->items[0]); if (u->items[1] != 0) { s += D_8016F7EC(u->items[1]); } if (u->items[2] != 0) { s += D_8016F7EC(u->items[2]); } return u->items[3] != 0 ? s + D_8016F7EC(u->items[3]) : s; }
f32 func_00235610(BattleUnit *u);
f32 func_00235610(BattleUnit *u);
s32 func_002363FC(BattleUnit *u) {
    f32 p = u->intel + BattleUnitItemSum79C(u) + 50;
    p *= (f32)(u->dex + BattleUnitItemSum7EC(u) + 100) / 50.0f;
    p *= (func_00235610(u) + 100.0f) / 100.0f;
    return p;
}
