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
unsigned char D_8016D200(int, int);
u16 func_000bcdd8(u8 l) {
    s32 sum = 0;
    s32 i = 0;
    s32 o = l * 0x36;
    for (; i < 9; i++) {
        u8 *b = D_80196AF8;
        u8 *g = b + o;
        u8 m = (g + i)[0x1180];
        if (m != 0xFF) {
            u8 a;
            u8 bb;
            if (m == 0 || m >= 100) {
                a = 1;
                bb = 1;
            } else {
                PlayerChar *p = &D_80193BC0_copy[m];
                a = p->c.cls;
                bb = p->c.baseCls;
            }
            sum += D_8016D200(a, bb);
        }
    }
    return sum;
}
