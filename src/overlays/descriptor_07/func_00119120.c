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
extern u8 D_80193672;
extern u8 D_80193673;
extern u8 D_801971F2[];
extern PlayerChar D_80193BC0_copy[];
extern Character D_80195560_copy[];
s32 func_00119120(s32 id, u8 side) {
    s32 c = D_801971F2[id * 25];
    s32 r;
    u8 f;
    if (id >= 30) {
        r = D_80195560_copy[c].hp == 0;
    } else {
        r = D_80193BC0_copy[c].c.hp == 0;
    }
    if (r) {
        if (side) {
            f = D_80193673 & 2;
        } else {
            f = D_80193672 & 2;
        }
        r &= -(f != 0);
    }
    return r;
}
