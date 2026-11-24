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
s32 D_801C8B84(BattleUnit *u);
u16 D_8016DF88(u8 a, u8 cls);
u16 D_8016DFDC(u8 a, u8 cls);
u16 D_8016E030(u8 a, u8 cls);
u16 D_8016E084(u8 a, u8 cls);
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
typedef struct {
    u8 cls;
    u8 to;
    u8 str;
    u8 vit;
    u8 kind;
} ClassChange22;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} Stock22;
extern ClassChange22 D_801F6A78[5];
extern Stock22 D_80196B00[];
extern u8 D_801936E0;
u16 D_8016DFDC(u8 a, u8 cls);
u16 D_8016E030(u8 a, u8 cls);
u16 D_8016E084(u8 a, u8 cls);
u16 D_8016B6FC(u16 id);
s32 func_00237AF8(BattleUnit *u, s32 k) {
    u32 j;
    u16 eq[4];
    u16 i;
    u16 s;
    if (D_801C8AEC() != 0) {
        return 0;
    }
    if (D_801C8AFC() != 0) {
        return 0;
    }
    if (D_801936E0 != 0) {
        return 0;
    }
    for (j = 0; j < 5; j++) {
        if (D_801F6A78[j].cls != u->cls) {
            continue;
        }
        if (D_801F6A78[j].kind != k) {
            continue;
        }
        if (D_801F6A78[j].str > u->str) {
            continue;
        }
        if (D_801F6A78[j].vit > u->vit) {
            continue;
        }
        if (D_801C8B84(u)) {
            eq[0] = D_8016DF88(D_801F6A78[j].to, D_801F6A78[j].to);
            eq[1] = D_8016DFDC(D_801F6A78[j].to, D_801F6A78[j].to);
            eq[2] = D_8016E030(D_801F6A78[j].to, D_801F6A78[j].to);
            eq[3] = D_8016E084(D_801F6A78[j].to, D_801F6A78[j].to);
            for (i = 0; i < 4; i++) {
                if (eq[i] == 0) {
                    continue;
                }
                s = D_8016B6FC(eq[i]);
                if (s >= 0x117) {
                    return 0;
                }
                if (eq[i] == D_8016DF88(u->cls, u->cls)) {
                    continue;
                }
                if (eq[i] == D_8016DFDC(u->cls, u->cls)) {
                    continue;
                }
                if (eq[i] == D_8016E030(u->cls, u->cls)) {
                    continue;
                }
                if (eq[i] == D_8016E084(u->cls, u->cls)) {
                    continue;
                }
                if (eq[i] == u->items[0] || eq[i] == u->items[1] || eq[i] == u->items[2] ||
                    eq[i] == u->items[3]) {
                    continue;
                }
                if (D_80196B00[s].count <= D_80196B00[s].equipped) {
                    return 0;
                }
            }
        }
        return D_801F6A78[j].to;
    }
    return 0;
}
