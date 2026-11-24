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
    u8 unk28[6];
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
int D_801C8B84(void *record);
s32 D_801C8E30(BattleUnit *actor);
void *D_801CA2E0(unsigned int lane, int row);
s32 func_00238798(BattleUnit *actor) {
    if (D_801C8B84(actor)) {
        if (actor->unk58 == 6) {
            return 1;
        }
        if (actor->unk58 == 7) {
            return D_801C8E30(D_801CA2E0(actor->lane, 6)) != 0;
        }
        if (actor->unk58 == 8) {
            if (!D_801C8E30(D_801CA2E0(actor->lane, 7))) {
                return 0;
            }
            return D_801C8E30(D_801CA2E0(actor->lane, 6)) != 0;
        }
    } else {
        if (actor->unk58 == 2) {
            return 1;
        }
        if (actor->unk58 == 1) {
            return D_801C8E30(D_801CA2E0(actor->lane, 2)) != 0;
        }
        if (actor->unk58 == 0) {
            if (!D_801C8E30(D_801CA2E0(actor->lane, 1))) {
                return 0;
            }
            return D_801C8E30(D_801CA2E0(actor->lane, 2)) != 0;
        }
    }
    return 1;
}
