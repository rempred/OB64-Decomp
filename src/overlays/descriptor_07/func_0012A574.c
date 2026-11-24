typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk0;
    u8 flags;
    u8 rest[0x17];
} SquadRec;
extern SquadRec g_func_001957D0_source_records[];
s32 func_00129068(u8 *sq);
u8 D_8016B088(u8 a, u8 b, u8 c, u8 d, u8 e);
s32 func_00129068(u8 *sq);
extern u32 *D_801F0CB0[];
void D_801B2D2C(u32 *o);
extern u8 D_801969B8[][11];
s32 func_0012E968(void *u);
s32 func_0012E9F4(u32 *u);
s32 func_0012E8EC(void *u);
void func_0012A574(u32 *u) {
    u8 cls[5];
    s32 lg;
    s32 pos;
    s32 i;
    u8 *l;
    if (!(*u & 0x40)) {
        return;
    }
    lg = func_0012E968(u);
    pos = func_0012E9F4(u);
    l = D_801969B8[lg];
    if (*u & 0x80) {
        l[1] &= ~5;
        g_func_001957D0_source_records[((u8 *)u)[4]].flags &= ~2;
        for (i = 0; i < 5; i++) {
            if ((l + i)[2] != 0xFF) {
                u32 *m = D_801F0CB0[(l + i)[2]];
                D_801B2D2C(m);
                *m &= ~0x80;
                *m &= ~0x40;
                *m &= ~0x4000;
                *m &= ~0x8000;
                *m &= ~0x10000;
            }
        }
    } else {
        u8 t;
        switch (pos) {
            case 1:
                t = l[5];
                l[5] = 0xFF;
                l[3] = t;
                break;
            case 2:
                t = l[6];
                l[6] = 0xFF;
                l[4] = t;
                break;
            case 3:
                l[5] = 0xFF;
                break;
            case 4:
                l[6] = 0xFF;
                break;
        }
        D_801B2D2C(u);
        *u &= ~0x40;
        *u &= ~0x4000;
        *u &= ~0x8000;
        *u &= ~0x10000;
        for (i = 0; i < 5; i++) {
            if ((l + i)[2] == 0xFF) {
                cls[i] = 0;
            } else {
                cls[i] = func_00129068(&g_func_001957D0_source_records[(l + i)[2]]);
            }
        }
        l[9] = D_8016B088(cls[0], cls[1], cls[2], cls[3], cls[4]);
    }
    l[10] = 11 - func_0012E8EC(D_801F0CB0[l[2]]);
}
