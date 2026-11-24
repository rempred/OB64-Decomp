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
s32 D_801C8E30(BattleUnit *u);
s32 D_801C8E9C(BattleUnit *u);
s32 func_002347B8(BattleUnit *u);
BattleUnit *D_801C9380(void);
BattleUnit *D_801C92F8(void);
s32 func_002347B8(BattleUnit *u) {
    BattleUnit *o;
    if (D_801C8B84(u)) {
        o = D_801C9380();
    } else {
        o = D_801C92F8();
    }
    if (D_801C8E30(o)) {
        return 0;
    }
    if (D_801C8E9C(u)) {
        return 0;
    }
    switch ((u32)o->cls) {
        case 0x09:
            if ((u32)(u->cls - 0x45) < 8) {
                return 10;
            }
            goto b;
        case 0x18:
        case 0x5A:
            if ((u32)(u->cls - 0x45) < 8) {
                return 15;
            }
        case 0x0A:
        b:
            if ((u32)(u->cls - 0x4E) < 3) {
                return 10;
            }
            goto c;
        case 0x19:
        case 0x7B:
            if ((u32)(u->cls - 0x4E) < 3) {
                return 15;
            }
        case 0x0E:
        c:
            if ((u32)(u->cls - 0x38) < 13) {
                return 10;
            }
            goto d;
        case 0x1D:
            if ((u32)(u->cls - 0x38) < 13) {
                return 15;
            }
        case 0x2B:
        case 0x36:
        d:
            switch ((u32)u->cls) {
                case 0x31:
                case 0x34:
                case 0x35:
                case 0x37:
                    return 10;
            }
            break;
        case 0x74:
            switch ((u32)u->cls) {
                case 0x31:
                case 0x34:
                case 0x35:
                case 0x37:
                    return 15;
            }
            return 0;
    }
    return 0;
}
