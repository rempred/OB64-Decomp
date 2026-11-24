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
u8 func_00133BE0(u8 *u);
extern u16 D_80190EBC[];
extern u8 D_80191010[];
extern u16 D_8019532C[];
extern u8 D_80195480[];
u8 func_00133BE0(u8 *u) {
    u8 max = 0;
    s32 k;
    s32 c;
    u16 *p;
    u16 *cap;
    u8 *f;
    for (k = 0; k < 5; k++) {
        c = g_func_001957D0_source_records[u[4]].members[k];
        if (c == 0) {
            continue;
        }
        if (c >= 100) {
            u16 m;
            u16 t;
            u16 v;
            if ((*(u32 *)((u8 *)(u) + (0))) & 8) {
                if (D_80191010[c] & 4) {
                    continue;
                }
                p = &D_80190EBC[c];
                cap = &D_80190EBC[99];
            } else {
                if (D_80195480[c] & 4) {
                    continue;
                }
                p = &D_8019532C[c];
                cap = &D_8019532C[99];
            }
            m = *cap;
            t = m / 3;
            v = *p;
            if (t >= v) {
                *p = v + 1;
                if (t < *p) {
                    *p = t;
                }
            } else {
                s32 t2 = t * 2;
                if (t2 >= v) {
                    *p = v + 1;
                    if (t2 < *p) {
                        *p = t2;
                    }
                } else if (m >= v) {
                    *p = v + 1;
                    if (*cap < *p) {
                        *p = *cap;
                    }
                } else {
                    *p = m;
                }
            }
            continue;
        }
        if (u[4] < 30) {
            if (D_80193BC0_copy[c].c.baseCls == 0 || D_80193BC0_copy[c].c.hp == 0 || (D_80193BC0_copy[c].c.status & 4)) {
                continue;
            }
            f = &D_80193BC0_copy[c].c.fatigue;
            p = &D_80193BC0_copy[c].c.hp;
            cap = &D_80193BC0_copy[c].c.maxHp;
        } else {
            if (D_80195560_copy[c].baseCls == 0 || D_80195560_copy[c].hp == 0 || (D_80195560_copy[c].status & 4)) {
                continue;
            }
            f = &D_80195560_copy[c].fatigue;
            p = &D_80195560_copy[c].hp;
            cap = &D_80195560_copy[c].maxHp;
        }
        if (*p == 0) {
            continue;
        }
        if (*f >= 2) {
            *f -= 2;
        } else {
            *f = 0;
        }
        if (max < *f) {
            max = *f;
        }
        if (*p < *cap) {
            *p += 1;
            if (*cap < *p) {
                *p = *cap;
            }
        }
    }
    return max;
}
