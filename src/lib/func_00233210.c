typedef signed char s8;
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
typedef struct {
    u8 unk000[0x1C4];
    BattleUnit units[20];
} BattleState;
extern u8 D_801976DC[];
s32 D_801C8B68(BattleUnit *u);
extern BattleState *D_801CE8BC;
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8C74(BattleUnit *u);
extern s8 D_801F69D0[11][2];
extern s8 D_801F69E8[11][2];
extern s8 D_801F6A00[];
s32 func_00233210(BattleUnit *a, BattleUnit *b) {
    s32 da;
    s32 dl;
    u32 i;
    u32 j;
    s32 v;
    if ((a == ((void *)0)) | (b == ((void *)0))) {
        return 0;
    }
    if (D_801C8AEC() != 0 || D_801C8AFC() != 0 || (u32)(a->unk48 - 0x51) < 3 || D_801C8B68(a) != 0 ||
        D_801C8C74(a) != 0 || D_801C8C74(b) != 0) {
        return 0;
    }
    if ((u8)*D_801976DC >= 30) {
        return 0;
    }
    da = a->unk34[0] - b->unk34[0];
    for (i = 0; i < 11; i++) {
        if (da >= D_801F69D0[i][0]) {
            da = D_801F69D0[i][1];
            break;
        }
    }
    dl = a->unk31[0] - b->unk31[0];
    for (j = 0; j < 11; j++) {
        if (dl <= D_801F69E8[j][0]) {
            dl = D_801F69E8[j][1];
            break;
        }
    }
    da += dl + D_801F6A00[(*(s32 *)((u8 *)(D_801CE8BC) + (0x1C0)))];
    if (da > 5) {
        da = 5;
    }
    if (da < -5) {
        da = -5;
    }
    v = a->unk34[0] + da;
    if (v < 0) {
        v = 0;
    }
    if (v > 100) {
        v = 100;
    }
    return v - a->unk34[0];
}
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8C74(BattleUnit *u);
