#include "game/combat_selector.h"
#include "game/combat_evaluator.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x40];
    s32 flags;
    u8 unk44[0x50];
    s32 w94;
} Msg21;
void D_801D90E0(void);
void D_80172394(void);
s32 D_8017223C(s32 a);
void D_801707F4(void);
void D_801D9F60(s32 a, s32 b, void *c, s32 d);
typedef struct {
    s32 w[20];
} Blob50;
s32 D_801C8B68(void *u);
void D_801AD9D4(Func001F0E64Record *b, unsigned int a);
s32 D_801AE4EC(void *a, Func001F197CState *b, s32 *c);
s32 D_801C8B08(void);
s32 D_801C8B84(void *u);
s32 D_801C8C58(void *u);
u8 D_8016FF5C(u8 a, u8 b);
void D_801D9F30(s32 a, s32 b, void *c);
s32 D_801C8E9C(void *u);
void D_801D9FF0(s32 a, s32 b, void *c, s32 d, s32 e, s32 f, s32 g);
void D_801D9F8C(s32 a, s32 b, void *c, s32 d, s32 e);
extern inline s32 func_002224F4(void) {
    s32 r;
    D_801D90E0();
    D_80172394();
    r = D_8017223C(0x10);
    D_801707F4();
    return r;
}
extern inline s32 func_0022257C(void *record, s32 a, s32 *c) {
    union { Blob50 copy; Func001F0E64Record selector; Func001F197CState evaluator; } local;
    local.copy = *(Blob50 *)record;
    D_801AD9D4(&local.selector, a);
    return D_801AE4EC(*(void **)(*(u8 **)((u8 *)record + 0x4C) + 0x40), &local.evaluator, c);
}
extern inline s32 CanUse222(u8 *u, u32 f) {
    s32 r = 0;
    s32 k = D_801C8B08();
    if (f & 0x8000) {
        return 0;
    }
    if (D_801C8B84(u) && (f & 0x400)) {
        r = 1;
    }
    if (D_801C8B68(u) && !(f & 0x400)) {
        r = 1;
    }
    if (k == 0) {
        r = 0;
    }
    if (r) {
        if (k == 0xFF) {
            if (!D_801C8C58(u)) {
                r = 0;
            }
        } else if (!D_8016FF5C(*(s32 *)(u + 0x48), k)) {
            r = 0;
        }
    }
    return r;
}
void func_00223514(u8 *m, s32 a, s32 pos, s32 c) {
    u32 f;
    if (D_801C8E9C(m) == 0) {
        D_801D9FF0(0xC, pos, m, 0xFF, 0xFF, 0xFF, c & 0xFF);
        pos += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x11, 0) + a;
        D_801D9F60(0xD, pos, m, 0xFF);
        pos += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x12, 0);
        D_801D9F60(0x23, pos, m, 0xFF);
        pos += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x26, 0);
        pos += 0x16;
        ((Msg21 *)m)->flags |= 2;
        D_801D9F30(0x2C, pos, m);
        f = func_002224F4();
        if (f != 0 && CanUse222(m, f)) {
            D_801D9F8C(0x1D, pos, m, 0xFF, 0x24);
            func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x24, 0);
        }
    } else {
        D_801D9FF0(0xC, pos, m, 0xFF, 0xFF, 0xFF, c & 0xFF);
    }
}
