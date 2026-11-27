struct NUScTask_s;
typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void * resource_alloc_mode1_wrapper(u32);
void *func_000016C4(void *ptr);
s32 func_002436F4(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
void memcpy_aligned(void *dst, void *src, s32 n);
s32 func_00243A1C(void);
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq20F;
extern Seq20F *D_801F0550;
void func_00019e10(void);
void func_0001b3a0(void (*)(struct NUScTask_s *));
void func_00243458(void);
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
} BgSeq20F;
s32 func_002436F4(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
typedef struct {
    u8 unk0[2];
    u8 type;
    u8 count;
    u16 w;
    u16 h;
} BgHdr20F;
typedef struct BgPart20F {
    u8 unk0[2];
    u8 type;
    u8 unk3;
    u16 w;
    u16 h;
    s32 size;
    struct BgPart20F *next;
} BgPart20F;
s32 func_00243A1C(void) {
    BgHdr20F hdr;
    BgPart20F parts[64];
    BgSeq20F *s;
    BgHdr20F *file;
    u8 count;
    u8 i;
    s32 bytes;
    s32 sz;
    BgPart20F *blk;
    BgPart20F *last;
    u8 *ret;
    last = ((void *)0);
    ret = ((void *)0);
    while (D_801F0550->step != 6) {
        func_00019e10();
        func_00243458();
    }
    func_0001b3a0(((void *)0));
    func_00019e10();
    func_000016C4(((BgSeq20F *)D_801F0550)->img);
    func_000016C4(((BgSeq20F *)D_801F0550)->tiles);
    file = (BgHdr20F *)((BgSeq20F *)D_801F0550)->out;
    if (((BgSeq20F *)D_801F0550)->n == 0) {
        s = ((BgSeq20F *)D_801F0550);
        D_801F0550 = ((void *)0);
        func_000016C4(s);
        return (s32)file;
    }
    *(u8 **)((s32)((BgSeq20F *)D_801F0550) + (((BgSeq20F *)D_801F0550)->n << 2) + 0x84) = (u8 *)file;
    ((u8 *)D_801F0550)[0x81]++;
    ((u8 *)D_801F0550)[0x7E]++;
    file = (BgHdr20F *)((BgSeq20F *)D_801F0550)->data[0];
    count = file->count;
    if (count < ((BgSeq20F *)D_801F0550)->n) {
        u8 *q;
        memcpy_aligned(&hdr, file, 8);
        q = (u8 *)(file + 1);
        for (i = 0; i < count; i++) {
            last = (BgPart20F *)q;
            memcpy_aligned(&parts[i], q, 16);
            q = (u8 *)last + (last->size + 16);
        }
        if (((BgSeq20F *)D_801F0550)->own == 1) {
            func_000016C4(((BgSeq20F *)D_801F0550)->data[0]);
        }
        sz = 8;
        hdr.type = 1;
        for (i = 0; i < count; i++) {
            bytes = parts[i].w * parts[i].h * 2;
            blk = resource_alloc_mode1_wrapper((sz += 0x10) + bytes);
            if (i == 0) {
                memcpy_aligned(blk, &hdr, 8);
                ret = (u8 *)blk;
                blk = (BgPart20F *)(ret + 8);
                last = blk;
            } else {
                last->next = blk;
                last = blk;
            }
            parts[i].size = bytes;
            memcpy_aligned(blk, &parts[i], 16);
            memcpy_aligned(blk + 1, *(u8 **)((i * 4) + (s32)((BgSeq20F *)D_801F0550) + 0x88), bytes);
            func_000016C4(*(u8 **)((i * 4) + (s32)((BgSeq20F *)D_801F0550) + 0x88));
            sz = 0;
        }
        last->next = ((void *)0);
        func_000016C4(D_801F0550);
        D_801F0550 = ((void *)0);
        return (s32)ret;
    }
    ((BgSeq20F *)D_801F0550)->size = 8;
    ret = (u8 *)(file + 1);
    count = file->count;
    for (i = 0; i < count; i++) {
        s32 type;
        s32 w;
        s32 h;
        last = (BgPart20F *)ret;
        ret += 0x10;
        type = ((BgHdr20F *)ret)->type;
        w = ((BgHdr20F *)ret)->w;
        h = ((BgHdr20F *)ret)->h;
        ((BgSeq20F *)D_801F0550)->size += last->w * last->h * 2 + 0x10;
        ret += 8;
        if (((BgSeq20F *)D_801F0550)->n == i + 1) {
            func_002436F4((s8)type, w, h, ret, 0, 1);
            return 0;
        }
        ret += last->size - 8;
    }
    return 0;
}
