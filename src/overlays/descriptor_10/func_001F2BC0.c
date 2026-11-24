#include "game/cutscene_panels.h"





void *func_00001330(unsigned int);
typedef struct {
    u8 unk0000[0x1C0];
    s32 strategy;
    u8 unk01C4[0x5020];
    s32 listB[0x36];
    s32 nB;
    s32 listA[0x100];
    s32 nA;
} Ctx1F;
extern Ctx1F *D_801CE8BC;
void func_001F2BC0(void *a, s32 b);
extern u8 D_800E9C0A[];
void func_001F265C();
void D_8017C2FC(Panel *);
void func_0002C950(signed char *dst, signed char *src);
u8 *D_8017C074(s32 a, s32 b, void *fn, s32 x0, s32 y0, s32 x1, s32 y1);
void bcopy(void *src, void *dst, s32 n);
s32 strlen(const s8 *s);
void func_001F2BC0(void *s, s32 right) {
    if (D_800E9C0A[5] != 0) {
        if (right != 0) {
            signed char *buf;
            u8 *w;
            Ctx1F *c;
            if ((*(void * *)((u8 *)(D_801CE8BC) + (0x5748))) != ((void *)0)) {
                D_8017C2FC((*(void * *)((u8 *)(D_801CE8BC) + (0x5748))));
            }
            func_0002C950((signed char *)D_801CE8BC + 0x56C4, s);
            buf = (signed char *)D_801CE8BC + 0x56C4;
            w = D_8017C074(0x100, 11, func_001F265C, 202, 210, 296, 228);
            (*(u8 * *)((u8 *)(w) + (0xD0))) = func_00001330(0x604);
            bcopy(buf, (*(u8 * *)((u8 *)(w) + (0xD0))), strlen(buf) + 1);
            (*(u8 * *)((u8 *)((*(u8 * *)((u8 *)(w) + (0xD0)))) + (0x530))) = (*(u8 * *)((u8 *)(w) + (0xD0)));
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F0] = 4;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F5] = 1;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F1] = 0;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5FC] = 0;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5FD] = 0;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F2] = 0;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F3] = 8;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F4] = 1;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F6] = 15;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5FE] = 2;
            (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F7] = 0;
            c = D_801CE8BC;
            (*(s16 *)((u8 *)(w) + (0x18))) = 0xFF;
            (*(u8 * *)((u8 *)(c) + (0x5748))) = w;
            (*(u8 *)((u8 *)(c) + (0x5744))) = 45;
            return;
        }
        {
        signed char *buf;
        u8 *w;
        Ctx1F *c;
        if ((*(void * *)((u8 *)(D_801CE8BC) + (0x574C))) != ((void *)0)) {
            D_8017C2FC((*(void * *)((u8 *)(D_801CE8BC) + (0x574C))));
        }
        func_0002C950((signed char *)D_801CE8BC + 0x5704, s);
        buf = (signed char *)D_801CE8BC + 0x5704;
        w = D_8017C074(0x100, 11, func_001F265C, 28, 131, 122, 149);
        (*(u8 * *)((u8 *)(w) + (0xD0))) = func_00001330(0x604);
        bcopy(buf, (*(u8 * *)((u8 *)(w) + (0xD0))), strlen(buf) + 1);
        (*(u8 * *)((u8 *)((*(u8 * *)((u8 *)(w) + (0xD0)))) + (0x530))) = (*(u8 * *)((u8 *)(w) + (0xD0)));
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F0] = 4;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F5] = 1;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F1] = 0;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5FC] = 0;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5FD] = 0;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F2] = 0;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F3] = 8;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F4] = 1;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F6] = 15;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5FE] = 2;
        (*(u8 * *)((u8 *)(w) + (0xD0)))[0x5F7] = 0;
        c = D_801CE8BC;
        (*(s16 *)((u8 *)(w) + (0x18))) = 0xFF;
        (*(u8 * *)((u8 *)(c) + (0x574C))) = w;
        (*(u8 *)((u8 *)(c) + (0x5745))) = 45;
        }
    }
}
void D_8017C2FC(Panel *);
void func_0002C950(signed char *dst, signed char *src);
u8 *D_8017C074(s32 a, s32 b, void *fn, s32 x0, s32 y0, s32 x1, s32 y1);
void bcopy(void *src, void *dst, s32 n);
s32 strlen(const s8 *s);
void D_8017C2FC(Panel *);
