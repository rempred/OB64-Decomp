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
s32 D_801C8E30(BattleUnit *u);
s32 D_801C8E9C(BattleUnit *u);
BattleUnit *D_801C8FE8(s32 i);
extern u8 D_801976DC[];
s32 D_801C8B68(BattleUnit *u);
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8C74(BattleUnit *u);
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8C74(BattleUnit *u);
extern s8 D_801F6A04[7][2];
void func_002333B4(void) {
    BattleUnit *u;
    s32 n;
    s32 sum;
    s32 i;
    u32 k;
    s32 v;
    s32 d;
    if (D_801C8AEC() == 0 && D_801C8AFC() == 0) {
        n = 0;
        if ((u8)*D_801976DC < 30) {
            sum = 0;
            for (i = 0; i < 20; i++) {
                u = D_801C8FE8(i);
                if (u != ((void *)0) && D_801C8B68(u) == 0 && D_801C8C74(u) == 0) {
                    n++;
                    sum += u->unk34[0];
                }
            }
            if (n != 0) {
                sum /= n;
                for (i = 0; i < 20; i++) {
                    u = D_801C8FE8(i);
                    if (D_801C8E30(u) == 0 && D_801C8B68(u) == 0 && D_801C8C74(u) == 0 &&
                        D_801C8E9C(u) == 0) {
                        d = sum - u->unk34[0];
                        for (k = 0; k < 7; k++) {
                            if (d >= D_801F6A04[k][0]) {
                                v = D_801F6A04[k][1] + u->unk34[0];
                                if (v < 0) {
                                    v = 0;
                                }
                                if (v > 100) {
                                    v = 100;
                                }
                                u->unk34[0] = v;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
