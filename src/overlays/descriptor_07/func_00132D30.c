typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_801969BA[];
s32 func_0012E968(void *u);
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
s32 func_00132D30(u8 *u) {
    u8 max = 0;
    s32 i;
    s32 k;
    s32 id;
    u8 *l;
    if (!((*(u32 *)((u8 *)(u) + (0))) & 0x40)) {
        for (i = 0; i < 5; i++) {
            id = g_func_001957D0_source_records[u[4]].members[i];
            if (id != 0) {
                if (id < 100) {
                    if (u[4] < 30) {
                        if (D_80193BC0_copy[id].c.hp != 0 && max < D_80193BC0_copy[id].c.fatigue) {
                            max = D_80193BC0_copy[id].c.fatigue;
                        }
                    } else {
                        if (D_80195560_copy[id].hp != 0 && max < D_80195560_copy[id].fatigue) {
                            max = D_80195560_copy[id].fatigue;
                        }
                    }
                }
            }
        }
    } else {
        l = &D_801969BA[func_0012E968(u) * 11];
        for (k = 0; k < 5; k++) {
            if (l[k] != 0xFF) {
                for (i = 0; i < 5; i++) {
                    id = g_func_001957D0_source_records[l[k]].members[i];
                    if (id != 0) {
                        if (id < 100) {
                            if (u[4] < 30) {
                                if (D_80193BC0_copy[id].c.hp != 0 && max < D_80193BC0_copy[id].c.fatigue) {
                                    max = D_80193BC0_copy[id].c.fatigue;
                                }
                            } else {
                                if (D_80195560_copy[id].hp != 0 && max < D_80195560_copy[id].fatigue) {
                                    max = D_80195560_copy[id].fatigue;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return !(max < 10);
}
