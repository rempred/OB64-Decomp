typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_801969BA[];
extern u8 *D_801F0CB0[];
s32 func_0012E968(void *u);
s32 func_00133700(u8 *u);
s32 func_00131480(void *u, s32 a);
s32 func_00131984(void);
extern u8 D_801F0E0A;
extern u8 D_801951B0[][0x24];
u8 func_00133BE0(u8 *u);
s32 func_00133700(u8 *u) {
    u8 rest = 0;
    s32 r = -1;
    u8 step;
    s32 t;
    u8 *loc;
    u8 *l;
    s32 m;
    if (!((*(u32 *)((u8 *)(u) + (0))) & 1)) {
        goto yes;
    }
    if ((*(u32 *)((u8 *)(u) + (0))) & 0x20000) {
        goto yes;
    }
    if ((((*(u32 *)((u8 *)(u) + (0))) & 0x40000) || (*(s32 *)((u8 *)(u) + (0x74))) == -1) && u[4] != 30) {
    } else {
        loc = D_801951B0[(*(s32 *)((u8 *)(u) + (0x74)))];
        if (((*(u32 *)((u8 *)(u) + (0))) & 8) && ((*(u16 *)((u8 *)(loc) + (0x1C))) & 2)) {
            goto yes;
        }
        if ((*(u16 *)((u8 *)(loc) + (0x1C))) & 4) {
            goto yes;
        }
        if (func_00131984() != 0) {
            goto yes;
        }
    }
    if (((*(u32 *)((u8 *)(u) + (0))) & 0x40040) == 0x40) {
        l = D_801F0CB0[D_801969BA[func_0012E968(u) * 11]];
        if (!((*(u32 *)((u8 *)(l) + (0))) & 0x40000) && (*(s32 *)((u8 *)(l) + (0x74))) != -1) {
            loc = D_801951B0[(*(s32 *)((u8 *)(l) + (0x74)))];
            if ((*(u32 *)((u8 *)(u) + (0))) & 8) {
                m = (*(u16 *)((u8 *)(loc) + (0x1C))) & 2;
            } else {
                m = (*(u16 *)((u8 *)(loc) + (0x1C))) & 4;
            }
            if (m != 0) {
            yes:
                rest = 1;
            }
        }
    }
    if (rest == 1) {
        step = 3;
        if (func_00131480(u, 0x1B) != 0) {
            step = 6;
        }
        if ((*(u16 *)((u8 *)(u) + (0xB6))) >= step) {
            (*(u16 *)((u8 *)(u) + (0xB6))) -= step;
        } else {
            (*(u16 *)((u8 *)(u) + (0xB6))) = 180;
            t = func_00133BE0(u);
            if (r < t) {
                r = t;
            }
        }
        if ((u32)(D_801F0E0A - 6) >= 12) {
            if ((*(u16 *)((u8 *)(u) + (0xB6))) >= 2) {
                (*(u16 *)((u8 *)(u) + (0xB6))) -= 2;
            } else {
                (*(u16 *)((u8 *)(u) + (0xB6))) = 180;
                t = func_00133BE0(u);
                if (r < t) {
                    r = t;
                }
            }
        }
    }
    return r;
}
s32 func_00131480(void *u, s32 a);
extern u8 D_801F0E0A;
u8 func_00133BE0(u8 *u);
