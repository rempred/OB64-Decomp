typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    signed char *name;
    u8 size;
    u8 gender;
    u8 leadership;
    u16 hpBase;
    u8 hpGrowth;
    u16 strBase;
    u8 strGrowth;
    u16 vitBase;
    u8 vitGrowth;
    u16 intBase;
    u8 intGrowth;
    u16 menBase;
    u8 menGrowth;
    u16 agiBase;
    u8 agiGrowth;
    u16 dexBase;
    u8 dexGrowth;
    u8 luck;
    u8 alignment;
    u8 resist[7];
    u8 movement;
    u16 defaultItems[4];
    u8 lockedSlots;
    u8 attacks[3][2];
    u8 physAttack;
    u8 magicAttack;
    u8 physDefense;
    u8 magicDefense;
    u8 promotions[4];
    u8 baseClass;
    u8 element;
    u8 squadSlots;
} ClassData;
typedef struct {
    u8 unk00[0x11];
    u8 cls;
    u8 baseCls;
    u8 level;
    u8 gender;
    u16 maxHp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 str;
    u16 vit;
    u16 intl;
    u16 men;
    u16 agi;
    u16 dex;
    u8 luck;
    u16 items[4];
    u8 fatigue;
    u8 status;
} Character;
extern ClassData g_func_0019554C_class_records[];
typedef struct {
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 pos[5];
    u8 harmony;
    u8 items[10];
    u8 strategy;
    u8 legion;
} SquadRec;
typedef struct {
    Character c;
    u8 unk34[4];
} PlayerChar;
typedef struct {
    u32 flags;
    u8 squad;
    u8 unk05[3];
    f32 x;
    f32 y;
    f32 z;
    s32 unk14;
    u8 unk18[0x34];
    f32 savedX;
    f32 savedY;
    f32 savedZ;
    u8 unk58[0xC];
    s32 unk64;
    u8 unk68[0x18];
    s32 unk80;
    s32 unk84;
    u8 unk88[9];
    u8 unk91;
    u8 unk92;
    u8 unk93[0x15];
    s32 *ids;
    u8 unkAC[0xE];
    u8 unkBA;
} MapUnit;
extern SquadRec g_func_001957D0_source_records[];
extern PlayerChar D_80193BC0_copy[];
extern Character D_80195560_copy[];
s32 func_001314D0(MapUnit *u, u16 id) {
    u8 sq;
    s32 player;
    u8 *m;
    u8 *end;
    if (id == 0) {
        return 0;
    found:
        return 1;
    }
    sq = u->squad;
    player = sq < 30;
    m = g_func_001957D0_source_records[sq].members;
    end = m + 5;
    do {
        s32 k = *m;
        Character *c;
        ClassData *cls;
        if (k >= 100 || k == 0) {
            goto next;
        }
        if (player) {
            c = &D_80193BC0_copy[k].c;
        } else {
            c = &D_80195560_copy[k];
        }
        if (c->items[0] == id || c->items[1] == id || c->items[2] == id || c->items[3] == id) {
            goto found;
        }
        if (g_func_0019554C_class_records[c->cls].baseClass != 0) {
            cls = &g_func_0019554C_class_records[c->baseCls];
        } else {
            cls = &g_func_0019554C_class_records[c->cls];
        }
        if (cls->defaultItems[0] == id || cls->defaultItems[1] == id || cls->defaultItems[2] == id ||
            cls->defaultItems[3] == id) {
            goto found;
        }
    next:
        m++;
    } while ((s32)m < (s32)end);
    return 0;
}
