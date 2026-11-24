#include "game/combat_selector.h"
#include "game/combat_evaluator.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
void D_801D9F60(s32 a, s32 b, void *c, s32 d);
void func_00224004(u8 *m, s32 a, s32 pos, s32 c, s32 d, u8 f, s32 g, s32 h, s32 k);
typedef struct {
    s32 w[20];
} Blob50;
void D_801AD9D4(Func001F0E64Record *b, unsigned int a);
s32 D_801AE4EC(void *a, Func001F197CState *b, s32 *c);
s32 D_801C8E9C(void *u);
void D_801D9FF0(s32 a, s32 b, void *c, s32 d, s32 e, s32 f, s32 g);
s32 D_801C8C74(void *u);
s32 D_801CA29C(void *u);
s32 D_801C9FB4(s32 a, s32 b);
extern inline s32 func_0022257C(void *record, s32 a, s32 *c) {
    union { Blob50 copy; Func001F0E64Record selector; Func001F197CState evaluator; } local;
    local.copy = *(Blob50 *)record;
    D_801AD9D4(&local.selector, a);
    return D_801AE4EC(*(void **)(*(u8 **)((u8 *)record + 0x4C) + 0x40), &local.evaluator, c);
}
extern u8 *D_801CE8C0;
void func_00223B78(u8 *m, s32 pos, s32 hit, u8 extra);
void func_00223D9C(u8 *m, s32 pos, u8 kind);
void func_00224004(u8 *m, s32 a, s32 pos, s32 c, s32 d, u8 f, s32 g, s32 h, s32 k) {
    s32 n;
    s32 before;
    s32 after;
    s32 bits;
    if (D_801C8E9C(m) == 0) {
        n = func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), g ? 0x11 : 0x19, 0) + a;
        if (g == 0) {
            D_801D9FF0(0x10, pos, m, 0xFF, c >> 8, c & 0xFF, d);
        } else {
            D_801D9FF0(k ? 0x32 : 0xC, pos, m, 0xFF, c >> 8, c & 0xFF, d);
            if (h) {
                D_801D9FF0(0x17, pos, 0, 0x5D, d, D_801CE8C0[0x821], D_801CA29C(m));
            }
        }
    } else {
        n = 6;
        D_801D9FF0(k ? 0x32 : 0xC, pos, m, 0xFF, c >> 8, c & 0xFF, d);
        if (h) {
            D_801D9FF0(0x17, pos, 0, 0x5D, d, D_801CE8C0[0x821], D_801CA29C(m));
        }
    }
    if (D_801C8C74(m)) {
        if (c < (*(u16 *)((u8 *)(m) + (0x20)))) {
            after = D_801C9FB4((*(u16 *)((u8 *)(m) + (0x20))) - c, (*(u16 *)((u8 *)(m) + (0x22))));
            before = D_801C9FB4((*(u16 *)((u8 *)(m) + (0x20))), (*(u16 *)((u8 *)(m) + (0x22))));
            (*(u16 *)((u8 *)(m) + (0x20))) -= c;
            if (before != after) {
                bits = ((1 << before) - 1) ^ ((1 << after) - 1);
                D_801D9F60(0x13, pos + n, m, bits);
                n += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x1D, 0);
                D_801D9F60(0x15, pos + n, m, bits);
            }
            if (after != 0) {
                func_00223B78(m, pos + n, g, f);
            }
        } else {
            func_00223D9C(m, pos + n, f);
        }
    } else if (c < (*(u16 *)((u8 *)(m) + (0x20)))) {
        (*(u16 *)((u8 *)(m) + (0x20))) -= c;
        func_00223B78(m, pos + n, g, f);
    } else {
        func_00223D9C(m, pos + n, f);
    }
}
