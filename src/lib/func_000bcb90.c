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
u16 func_000bcb90(void) {
    s32 i;
    s32 n;
    PlayerChar *pc;
    for (i = 0, n = 0, pc = D_80193BC0_copy; i < 0xDC; pc++, i++) {
        u8 *p = D_80196AF8 + 0x1872 + i * 2;
        if (i == 0 || i >= 100) {
            *p |= 0x80;
        } else {
            u8 v = *p;
            if ((v & 0x10) || pc->c.cls >= 0x51) {
                *p = v | 0x80;
            } else {
                *p = v & 0x7F;
                n++;
            }
        }
    }
    return n;
}
