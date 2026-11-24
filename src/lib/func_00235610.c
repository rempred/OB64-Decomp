typedef signed char s8;
typedef unsigned char u8;
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
s32 func_002347B8(BattleUnit *u);
typedef struct {
    u8 mode;
    u8 unk1[3];
    u8 flags;
} BattleMode;
extern BattleMode D_801976D9;
s32 func_002347B8(BattleUnit *u);
u8 D_8016DBD8(u8 a, u8 cls);
extern s8 D_801F6910[7][27];
u8 D_8016DBD8(u8 a, u8 cls);
extern s8 D_801F6910[7][27];
f32 func_00235610(BattleUnit *u) {
    u32 k = D_8016DBD8(u->unk48, u->cls);
    u32 m;
    f32 p;
    s32 b;
    k = (k - 1) % 7;
    m = 15;
    if (!(D_801976D9.mode & 0x80)) {
        m = D_801976D9.mode;
    }
    m %= 27;
    p = D_801F6910[k][m];
    p += func_002347B8(u);
    if (u == ((void *)0) || u->unk3E < 70) {
        b = 0;
    } else if (u->unk3E < 80) {
        b = 5;
    } else if (u->unk3E < 90) {
        b = 18;
    } else {
        b = 40;
    }
    return p - b;
}
f32 func_00235610(BattleUnit *u);
