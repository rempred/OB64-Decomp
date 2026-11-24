#include "common/task_framebuffer.h"
extern void * resource_alloc_mode1_wrapper(unsigned int);
void *func_000016C4(void *ptr);
extern u8 *D_8019A660;
void func_00019e10(void);
s32 func_00068fb0(void);
s32 func_00068c88(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
void memcpy_aligned(void *dst, void *src, s32 n);
void func_000689ec(void);
void func_0001b3a0(void (*func)(NUScTask *));
s32 func_00068c88(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
typedef struct {
    u8 unk0[2];
    u8 type;
    u8 count;
    u16 w;
    u16 h;
} BgHdr680;
typedef struct BgPart680 {
    u8 unk0[2];
    u8 type;
    u8 unk3;
    u16 w;
    u16 h;
    s32 size;
    struct BgPart680 *next;
} BgPart680;
typedef struct {
    u8 unk00[0x60];
    void *tiles;
    u8 unk64[4];
    void *img;
    u8 unk6C[8];
    u8 *out;
    u8 unk78[6];
    u8 step;
    u8 unk7F[2];
    u8 n;
    u8 own;
    u8 unk83;
    u8 *data[65];
    s32 size;
} BgSeq680;
s32 func_00068fb0(void) {
    BgHdr680 hdr;
    BgPart680 parts[64];
    BgSeq680 *s;
    BgHdr680 *file;
    u8 count;
    u8 i;
    s32 bytes;
    s32 sz;
    BgPart680 *blk;
    BgPart680 *last;
    u8 *ret;
    last = ((void *)0);
    ret = ((void *)0);
    while (((BgSeq680 *)D_8019A660)->step != 6) {
        func_00019e10();
        func_000689ec();
    }
    func_0001b3a0(((void *)0));
    func_00019e10();
    func_000016C4(((BgSeq680 *)D_8019A660)->img);
    func_000016C4(((BgSeq680 *)D_8019A660)->tiles);
    file = (BgHdr680 *)((BgSeq680 *)D_8019A660)->out;
    if (((BgSeq680 *)D_8019A660)->n == 0) {
        s = ((BgSeq680 *)D_8019A660);
        D_8019A660 = ((void *)0);
        func_000016C4(s);
        return (s32)file;
    }
    *(u8 **)((s32)((BgSeq680 *)D_8019A660) + (((BgSeq680 *)D_8019A660)->n << 2) + 0x84) = (u8 *)file;
    ((u8 *)D_8019A660)[0x81]++;
    ((u8 *)D_8019A660)[0x7E]++;
    file = (BgHdr680 *)((BgSeq680 *)D_8019A660)->data[0];
    count = file->count;
    if (count < ((BgSeq680 *)D_8019A660)->n) {
        u8 *q;
        memcpy_aligned(&hdr, file, 8);
        q = (u8 *)(file + 1);
        for (i = 0; i < count; i++) {
            last = (BgPart680 *)q;
            memcpy_aligned(&parts[i], q, 16);
            q = (u8 *)last + (last->size + 16);
        }
        if (((BgSeq680 *)D_8019A660)->own == 1) {
            func_000016C4(((BgSeq680 *)D_8019A660)->data[0]);
        }
        sz = 8;
        hdr.type = 1;
        for (i = 0; i < count; i++) {
            bytes = parts[i].w * parts[i].h * 2;
            blk = resource_alloc_mode1_wrapper((sz += 0x10) + bytes);
            if (i == 0) {
                memcpy_aligned(blk, &hdr, 8);
                ret = (u8 *)blk;
                blk = (BgPart680 *)(ret + 8);
                last = blk;
            } else {
                last->next = blk;
                last = blk;
            }
            parts[i].size = bytes;
            memcpy_aligned(blk, &parts[i], 16);
            memcpy_aligned(blk + 1, *(u8 **)((i * 4) + (s32)((BgSeq680 *)D_8019A660) + 0x88), bytes);
            func_000016C4(*(u8 **)((i * 4) + (s32)((BgSeq680 *)D_8019A660) + 0x88));
            sz = 0;
        }
        last->next = ((void *)0);
        func_000016C4(D_8019A660);
        D_8019A660 = ((void *)0);
        return (s32)ret;
    }
    ((BgSeq680 *)D_8019A660)->size = 8;
    ret = (u8 *)(file + 1);
    count = file->count;
    for (i = 0; i < count; i++) {
        s32 type;
        s32 w;
        s32 h;
        last = (BgPart680 *)ret;
        ret += 0x10;
        type = ((BgHdr680 *)ret)->type;
        w = ((BgHdr680 *)ret)->w;
        h = ((BgHdr680 *)ret)->h;
        ((BgSeq680 *)D_8019A660)->size += last->w * last->h * 2 + 0x10;
        ret += 8;
        if (((BgSeq680 *)D_8019A660)->n == i + 1) {
            func_00068c88((s8)type, w, h, ret, 0, 1);
            return 0;
        }
        ret += last->size - 8;
    }
    return 0;
}
