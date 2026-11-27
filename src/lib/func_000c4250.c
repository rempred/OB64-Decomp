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
u16 func_000c4250(void) {
    s32 i;
    u16 n;
    for (i = 0, n = 0; i < 100; i++) {
        Character *c = &D_80193BC0_copy[i].c;
        u8 cls = c->cls;
        u8 base = c->baseCls;
        u8 *f = D_80196AF8 + (0x1872 + i * 2);
        if (i == 0) {
            *f |= 0x80;
        } else {
            if (base == 0 || (*f & 0xA)) {
                continue;
            }
            if (D_8016DEC4(cls, base) == 0) {
                *f |= 0x80;
            } else {
                n++;
                *f &= 0x7F;
            }
        }
    }
    return n;
}
