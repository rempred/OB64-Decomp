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
extern Character D_80195560_copy[];
extern void **D_801ED5C0;
extern u8 g_func_001957D0_source_records[];
u8 D_8016DE1C(u8 cls, u8 base);
void func_00135EE4(s32 k, s32 side) {
    u8 *w = (u8 *)D_801ED5C0;
    u8 *sq;
    u8 *g;
    s32 i;
    if (k < 50) {
        sq = &g_func_001957D0_source_records[k * 25];
    } else {
        sq = ((void *)0);
    }
    if (side == 0) {
        (*(u8 * *)((u8 *)(w) + (0xC))) = sq;
        g = w + 0x14;
    } else {
        (*(u8 * *)((u8 *)(w) + (0x10))) = sq;
        g = w + 0x23;
    }
    for (i = 0; i < 15; i++) {
        if (i < 9) {
            g[i] = 0xF;
        } else {
            g[i] = 0;
        }
    }
    if (sq == ((void *)0)) {
        return;
    }
    for (i = 0; i < 5; i++) {
        u8 id = (sq + i)[2];
        s32 pos = (sq + i)[7];
        u8 cls;
        u8 base;
        u8 *c;
        if (id >= 100) {
            base = 0;
            cls = 0;
            id = 0;
        } else if (sq[0] >= 31) {
            cls = D_80195560_copy[id].cls;
            base = D_80195560_copy[id].baseCls;
        } else {
            cls = D_80193BC0_copy[id].c.cls;
            base = D_80193BC0_copy[id].c.baseCls;
        }
        if (id == 0) {
            continue;
        }
        if (D_8016DE1C(cls, base) != 2) {
            continue;
        }
        (w + pos)[0x14] = 0xF;
        if (pos < 6) {
            c = (u8 *)(pos + (s32)g);
            c[9] |= 3;
            switch (pos % 3) {
                case 0:
                    c[0xA] |= 1;
                    c[1] |= 5;
                    break;
                case 1:
                    c[0xA] |= 1;
                    c[8] |= 2;
                    c[-1] |= 0xA;
                    c[1] |= 5;
                    break;
                case 2:
                    c[8] |= 2;
                    c[-1] |= 0xA;
                    break;
            }
        }
        if (pos < 3) {
            continue;
        }
        {
            u8 *d = (u8 *)(pos + (s32)g);
            d[-3] &= 3;
            switch (pos % 3) {
                case 0:
                    d[-2] &= 0xB;
                    break;
                case 1:
                    d[-2] &= 0xB;
                    d[-4] &= 7;
                    break;
                case 2:
                    d[-4] &= 7;
                    break;
            }
        }
    }
}
