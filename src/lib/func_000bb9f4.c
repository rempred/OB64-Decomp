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
u8 D_8016D2A8(u8 cls, u8 base);
extern u16 (*D_801EF288[])(u8 cls, u8 base);
u8 func_000bb9f4(Character *c) {
    s32 i;
    s32 bit = 1;
    u8 n;
    for (i = 0, n = 0; i < 4; i++, bit <<= 1) {
        if (D_801EF288[i](c->cls, c->baseCls) != 0) {
            if (!(D_8016D2A8(c->cls, c->baseCls) & bit)) {
                n++;
            }
        }
    }
    return n;
}
