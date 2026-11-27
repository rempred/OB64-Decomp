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
extern u8 *D_80196AF8;
extern PlayerChar D_80193BC0_copy[];
unsigned char D_8016DEC4(int, int);
u16 func_000c3f50(u16 k) {
    s32 i;
    s32 n;
    u8 *g = D_80196AF8 + (0x117C + k * 0x36);
    for (i = 0, n = 0; i < 9; i++) {
        u8 m = (g + i)[4];
        if (m != 0xFF) {
            Character *c = &D_80193BC0_copy[m].c;
            u8 *f = D_80196AF8 + (0x1872 + m * 2);
            u8 cls = c->cls;
            u8 base = c->baseCls;
            if (m >= 100 || D_8016DEC4(cls, base) == 0) {
                *f |= 0x80;
            } else {
                n++;
                *f &= 0x7F;
            }
        }
    }
    return n;
}
