#include "game/combat_selector.h"
#include "game/combat_evaluator.h"
typedef unsigned char u8;
typedef signed int s32;
void D_801D9F60(s32 a, s32 b, void *c, s32 d);
typedef struct {
    s32 w[20];
} Blob50;
void D_801AD9D4(Func001F0E64Record *b, unsigned int a);
s32 D_801AE4EC(void *a, Func001F197CState *b, s32 *c);
void D_801D9F8C(s32 a, s32 b, void *c, s32 d, s32 e);
extern inline s32 func_0022257C(void *record, s32 a, s32 *c) {
    union { Blob50 copy; Func001F0E64Record selector; Func001F197CState evaluator; } local;
    local.copy = *(Blob50 *)record;
    D_801AD9D4(&local.selector, a);
    return D_801AE4EC(*(void **)(*(u8 **)((u8 *)record + 0x4C) + 0x40), &local.evaluator, c);
}
void func_00223A38(u8 *m, s32 a, s32 b, u8 k) {
    D_801D9F8C(0x11, b, m, 0xFF, k);
    b += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x19, 0) + a;
    D_801D9F60(0x12, b, m, 0xFF);
    b += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x1A, 0);
    (*(s32 *)((u8 *)(m) + (0x94))) = b;
}
