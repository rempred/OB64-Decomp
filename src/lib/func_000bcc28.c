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
extern u8 D_80193BD1[][0x38];
unsigned char D_8016DEC4(int, int);
extern inline int func_000bba9c(void *record) {
    Character *c = record;
    u8 r = 1;
    if (c->cls == 0 || (c->status & 4) || c->hp == 0) {
        r = 0;
    }
    return r;
}
u16 func_000bcc28(void) {
    s32 i;
    u16 n;
    for (i = 0, n = 0; i < 30; i++) {
        u8 *g = D_80196AF8 + (0x117C + i * 0x36);
        u8 l;
        if (g[3] == 0xFF) {
            continue;
        }
        l = (g + g[3])[4];
        if (g[1] & 0x18) {
            continue;
        }
        if (D_8016DEC4(D_80193BD1[l][0], D_80193BD1[l][1]) != 2) {
            continue;
        }
        if (func_000bba9c(&D_80193BC0_copy[(g + g[3])[4]].c) != 0) {
            n++;
        }
    }
    return n;
}
