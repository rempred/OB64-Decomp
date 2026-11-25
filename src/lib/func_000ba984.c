typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
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
typedef struct {
    Character c;
    u8 pad[4];
} PlayerChar;
extern PlayerChar D_80193BC0_copy[];
extern u8 *D_80196AF8;
typedef struct {
    u8 b[0xE];
} Group87;
typedef struct {
    u8 b[0x36];
} SquadRec87;
typedef struct {
    u8 pad[0x10D4];
    Group87 g[1];
} Save87Groups;
typedef struct {
    u8 pad[0x117C];
    SquadRec87 sq[1];
} Save87Squads;
void func_000ba984(u8 k) {
    s32 i;
    u8 r;
    switch (k) {
        case 0:
            for (i = 1, r = 1; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x5D8))); i++, r++) {
                D_80193BC0_copy[(D_80196AF8 + i)[0x1A2E]].pad[0] = r;
            }
            break;
        case 1:
            for (i = 0, r = 1; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x2C4))); i++, r++) {
                ((Save87Squads *)D_80196AF8)->sq[(D_80196AF8 + i)[0x1A92]].b[0] = r;
            }
            break;
        case 2:
            for (i = 0, r = 1; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x5DC))); i++, r++) {
                ((Save87Groups *)D_80196AF8)->g[(D_80196AF8 + i)[0x1AB0]].b[0] = r;
            }
            break;
    }
}
