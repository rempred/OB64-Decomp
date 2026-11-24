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
BattleUnit *D_801C8FE8(s32 actor_index);
void func_00237D5C(s32 actor_index, s32 *out_formation_column, s32 *out_formation_row) {
    if (actor_index < 20) {
        BattleUnit *actor = D_801C8FE8(actor_index);
        *out_formation_column = actor->lane;
        *out_formation_row = actor->unk58;
    } else if (actor_index < 47) {
        actor_index -= 20;
        *out_formation_column = actor_index % 3;
        *out_formation_row = actor_index / 3;
    } else if (actor_index < 87) {
        actor_index -= 47;
        *out_formation_column = actor_index % 4;
        *out_formation_row = actor_index / 4;
    } else {
        *out_formation_column = -1;
        *out_formation_row = -1;
    }
}
