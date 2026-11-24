#include "common/task_framebuffer.h"
void *func_00001330(unsigned int size);
extern void * resource_alloc_mode1_wrapper(unsigned int);
void *func_000016C4(void *ptr);
void func_00019e10(void);
extern u8 D_800E7A0C;
extern void *D_800C4BB8;
extern void *D_800A8204[3];
extern u8 D_800E7A0C;
extern void *D_800C4BB8;
extern void *D_800A8204[3];
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq1ED;
extern Seq1ED *D_801BA6D0;
s32 func_001EDD54(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
void bzero(void *p, s32 n);
void func_001ED888(NUScTask *task);
extern inline void func_001EDCB8(u8 *o) {
    func_00019e10();
    o[0] = 0;
    o[1] = 1;
    if (D_800E7A0C == 1) {
        if (D_800C4BB8 == D_800A8204[0]) {
            o[0] = 1;
            o[1] = 2;
        } else if (D_800C4BB8 == D_800A8204[1]) {
            o[0] = 0;
            o[1] = 2;
        } else if (D_800C4BB8 == D_800A8204[2]) {
            o[0] = 0;
            o[1] = 1;
        }
    }
}
typedef struct {
    s16 x;
    s16 y;
    s16 w;
    s16 h;
} BgTile1ED;
typedef struct {
    u8 unk00[0x68];
    void *img;
    u8 unk6C[0xC];
    s16 w;
    s16 h;
} BgState1ED;
void func_0001b650(void *src, void *dst);
void func_0001b3a0(void (*func)(NUScTask *));
s32 func_001EDD54(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b) {
    u8 o[2];
    s16 n;
    s16 k;
    s16 i;
    s16 j;
    if (D_801BA6D0 == ((void *)0)) {
        D_801BA6D0 = func_00001330(0x190);
        bzero(D_801BA6D0, 0x190);
        ((u8 *)D_801BA6D0)[0x81] = 0;
    } else if (((u8 *)D_801BA6D0)[0x81] == 0) {
        return -1;
    }
    n = (w >> 4) * (h >> 4);
    if (b == 0) {
        (*(void * *)((u8 *)(D_801BA6D0) + (0x74))) = resource_alloc_mode1_wrapper(w * h * 2 + 8);
    } else {
        (*(void * *)((u8 *)(D_801BA6D0) + (0x74))) = func_00001330(w * h * 2);
    }
    func_001EDCB8(o);
    (*(void * *)((u8 *)(D_801BA6D0) + (0x64))) = D_800A8204[o[0]];
    (*(BgTile1ED * *)((u8 *)(D_801BA6D0) + (0x60))) = func_00001330(n * 8);
    (*(void * *)((u8 *)(D_801BA6D0) + (0x5C))) = D_800A8204[o[1]];
    ((u8 *)D_801BA6D0)[0x80] = b;
    ((BgState1ED *)D_801BA6D0)->img = func_00001330(n * 0x300);
    ((BgState1ED *)D_801BA6D0)->w = w;
    ((BgState1ED *)D_801BA6D0)->h = h;
    D_801BA6D0->step = 0;
    (*(s16 *)((u8 *)(D_801BA6D0) + (0x7C))) = type;
    (*(u8 * *)((u8 *)(D_801BA6D0) + (0x6C))) = data;
    ((u8 *)D_801BA6D0)[0x7F] = a;
    k = 0;
    for (i = 0; i < (h >> 4); i++) {
        for (j = 0; j < (w >> 4); j++) {
            (*(BgTile1ED * *)((u8 *)(D_801BA6D0) + (0x60)))[k].x = j * 64;
            (*(BgTile1ED * *)((u8 *)(D_801BA6D0) + (0x60)))[k].y = i * 64;
            (*(BgTile1ED * *)((u8 *)(D_801BA6D0) + (0x60)))[k].w = 0x400;
            (*(BgTile1ED * *)((u8 *)(D_801BA6D0) + (0x60)))[k].h = 0x400;
            k++;
        }
    }
    func_0001b650((*(u8 * *)((u8 *)(D_801BA6D0) + (0x6C))), (*(void * *)((u8 *)(D_801BA6D0) + (0x68))));
    if (((u8 *)D_801BA6D0)[0x7F] == 1) {
        func_000016C4((*(u8 * *)((u8 *)(D_801BA6D0) + (0x6C))) - 8);
    }
    func_0001b3a0(func_001ED888);
    return 0;
}
