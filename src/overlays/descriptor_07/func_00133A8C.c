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
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 pos[5];
    u8 harmony;
    u8 items[10];
    u8 strategy;
    u8 legion;
} Squad132;
typedef struct {
    Character c;
    u8 unk34[4];
} Player132;
extern Squad132 g_func_001957D0_source_records[];
extern Player132 D_80193BC0_copy[];
extern Character D_80195560_copy[];
u8 func_00133A8C(u8 *u);
extern u8 D_8018F481_check1;
u8 func_00133A8C(u8 *u) {
    u8 max = 0;
    s32 i;
    for (i = 0; i < 5; i++) {
        s32 id = g_func_001957D0_source_records[u[4]].members[i];
        if (id != 0) {
            if (id < 100) {
                u8 *f;
                u16 *hp;
                if (u[4] < 30) {
                    if (D_80193BC0_copy[id].c.hp != 0 && !(D_80193BC0_copy[id].c.status & 4)) {
                        f = &D_80193BC0_copy[id].c.fatigue;
                        hp = &D_80193BC0_copy[id].c.hp;
                        goto tire;
                    }
                } else {
                    if (D_80195560_copy[id].hp != 0 && !(D_80195560_copy[id].status & 4)) {
                        f = &D_80195560_copy[id].fatigue;
                        hp = &D_80195560_copy[id].hp;
                    tire:
                        if (*hp != 0) {
                            u32 cap = 100;
                            if ((u32)(D_8018F481_check1 - 0x3F) < 2) {
                                cap = 50;
                            }
                            if (*f < cap) {
                                (*f)++;
                            }
                            if (max < *f) {
                                max = *f;
                            }
                        }
                    }
                }
            }
        }
    }
    return max;
}
