typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
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
extern u8 D_8018F481_check1;
extern PlayerChar D_80193BC0_copy[];
extern Character D_80195560_copy[];
extern u8 D_801975DA;
s32 func_00139CE8(void) {
    s32 r = 0;
    if (D_80193BC0_copy[1].c.hp != 0) {
        u32 v = ((u8 *)&D_80193BC0_copy[1].c)[0x33] & 4;
        r = v == 0;
    }
    if (r == 1 && D_8018F481_check1 == 4) {
        r = 0;
        if (D_80195560_copy[D_801975DA].hp != 0) {
            u32 v = ((u8 *)&D_80195560_copy[D_801975DA])[0x33] & 4;
            r = v == 0;
        }
    }
    return r;
}
