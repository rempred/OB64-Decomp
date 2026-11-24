#include "common/task_framebuffer.h"
extern void * resource_alloc_mode1_wrapper(unsigned int);
void *func_000016C4(void *ptr);
void func_00019e10(void);
s32 func_001EE07C(void);
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq1ED;
extern Seq1ED *D_801BA6D0;
s32 func_001EDD54(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
void memcpy_aligned(void *dst, void *src, s32 n);
void func_001EDAB8(void);
void func_0001b3a0(void (*func)(NUScTask *));
s32 func_001EDD54(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
typedef struct {
    u8 unk0[2];
    u8 type;
    u8 count;
    u16 w;
    u16 h;
} BgHdr1ED;
typedef struct BgPart1ED {
    u8 unk0[2];
    u8 type;
    u8 unk3;
    u16 w;
    u16 h;
    s32 size;
    struct BgPart1ED *next;
} BgPart1ED;
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
} BgSeq1ED;
s32 func_001EE07C(void) {
    BgHdr1ED hdr;
    BgPart1ED parts[64];
    BgSeq1ED *s;
    BgHdr1ED *file;
    u8 count;
    u8 i;
    s32 bytes;
    s32 sz;
    BgPart1ED *blk;
    BgPart1ED *last;
    u8 *ret;
    last = ((void *)0);
    ret = ((void *)0);
    while (D_801BA6D0->step != 6) {
        func_00019e10();
        func_001EDAB8();
    }
    func_0001b3a0(((void *)0));
    func_00019e10();
    func_000016C4(((BgSeq1ED *)D_801BA6D0)->img);
    func_000016C4(((BgSeq1ED *)D_801BA6D0)->tiles);
    file = (BgHdr1ED *)((BgSeq1ED *)D_801BA6D0)->out;
    if (((BgSeq1ED *)D_801BA6D0)->n == 0) {
        s = ((BgSeq1ED *)D_801BA6D0);
        D_801BA6D0 = ((void *)0);
        func_000016C4(s);
        return (s32)file;
    }
    *(u8 **)((s32)((BgSeq1ED *)D_801BA6D0) + (((BgSeq1ED *)D_801BA6D0)->n << 2) + 0x84) = (u8 *)file;
    ((u8 *)D_801BA6D0)[0x81]++;
    ((u8 *)D_801BA6D0)[0x7E]++;
    file = (BgHdr1ED *)((BgSeq1ED *)D_801BA6D0)->data[0];
    count = file->count;
    if (count < ((BgSeq1ED *)D_801BA6D0)->n) {
        u8 *q;
        memcpy_aligned(&hdr, file, 8);
        q = (u8 *)(file + 1);
        for (i = 0; i < count; i++) {
            last = (BgPart1ED *)q;
            memcpy_aligned(&parts[i], q, 16);
            q = (u8 *)last + (last->size + 16);
        }
        if (((BgSeq1ED *)D_801BA6D0)->own == 1) {
            func_000016C4(((BgSeq1ED *)D_801BA6D0)->data[0]);
        }
        sz = 8;
        hdr.type = 1;
        for (i = 0; i < count; i++) {
            bytes = parts[i].w * parts[i].h * 2;
            blk = resource_alloc_mode1_wrapper((sz += 0x10) + bytes);
            if (i == 0) {
                memcpy_aligned(blk, &hdr, 8);
                ret = (u8 *)blk;
                blk = (BgPart1ED *)(ret + 8);
                last = blk;
            } else {
                last->next = blk;
                last = blk;
            }
            parts[i].size = bytes;
            memcpy_aligned(blk, &parts[i], 16);
            memcpy_aligned(blk + 1, *(u8 **)((i * 4) + (s32)((BgSeq1ED *)D_801BA6D0) + 0x88), bytes);
            func_000016C4(*(u8 **)((i * 4) + (s32)((BgSeq1ED *)D_801BA6D0) + 0x88));
            sz = 0;
        }
        last->next = ((void *)0);
        func_000016C4(D_801BA6D0);
        D_801BA6D0 = ((void *)0);
        return (s32)ret;
    }
    ((BgSeq1ED *)D_801BA6D0)->size = 8;
    ret = (u8 *)(file + 1);
    count = file->count;
    for (i = 0; i < count; i++) {
        s32 type;
        s32 w;
        s32 h;
        last = (BgPart1ED *)ret;
        ret += 0x10;
        type = ((BgHdr1ED *)ret)->type;
        w = ((BgHdr1ED *)ret)->w;
        h = ((BgHdr1ED *)ret)->h;
        ((BgSeq1ED *)D_801BA6D0)->size += last->w * last->h * 2 + 0x10;
        ret += 8;
        if (((BgSeq1ED *)D_801BA6D0)->n == i + 1) {
            func_001EDD54((s8)type, w, h, ret, 0, 1);
            return 0;
        }
        ret += last->size - 8;
    }
    return 0;
}
