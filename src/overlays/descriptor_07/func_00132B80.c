#include "game/panel_constructor.h"




void *D_8009DD38(u32 handle);
void *func_00001330(unsigned int);
void *func_000016C4(void *ptr);
extern Panel *D_801EB284;
extern void *D_801EB288;
extern void *D_801EB28C;
void bcopy(void *src, void *dst, s32 n);
void *func_0000978C(unsigned int, ...);

void D_8020CDA0(s32 se);
extern s16 D_801F0B50;
void func_00132538();
void func_00132B80(s32 k) {
    s16 saved_k = k;
    void **p = &D_801EB288;
    *p = 0;
    D_801EB28C = ((void *)0);
    if (k & 0x8000) {
        u8 *src = D_8009DD38(0x01DEE82C);
        u8 *pal = func_00001330(0x300);
        bcopy(src, pal, 0x200);
        bcopy(src + (((k & 0x7FFF) << 8) + 0x100), pal + 0x200, 0x100);
        func_000016C4(src);
        D_801EB28C = pal;
    }
    *p = func_0000978C(0x0218E9B4, 0x15, -3, 6);
    D_801EB284 = D_8017BFB0(0, 0, func_00132538, 0x9E, 0xA4, 0xA2, 0xA8, 0x5A, 0x95, 0xE6, 0xB7);
    D_8020CDA0(0x2D3);
    D_801F0B50 = saved_k;
}
