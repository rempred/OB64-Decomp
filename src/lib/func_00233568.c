typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
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
u16 D_801C8FB8(BattleUnit *u);
s32 D_8016F5E0(u16 a);
u16 D_8016FB50(u16 a, u16 b, u16 c, u16 d);
u8 func_00233568(BattleUnit *u) {
    s32 r;
    s32 k;
    r = D_8016FB50(u->items[0], u->items[1], u->items[2], u->items[3]);
    if (r == 0) {
        r = D_801C8FB8(u);
        if (r == 0) {
            goto none;
        }
    }
    k = D_8016F5E0(r);
    if ((u8)k == 8) {
    none:
        k = u->unk33;
    }
    return k;
}
