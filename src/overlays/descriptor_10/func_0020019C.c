typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
typedef struct {
    u8 *spr;
    u8 unk04[0x2C];
    u8 *spr2;
    u8 unk34[0x2C];
    u8 *units;
    u32 nUnits;
    u8 *objs;
    void *buf6C;
    u32 nObjs;
    s32 unk74;
    void *buf78;
    void *buf7C;
    void *buf80;
    u8 unk84[0x1C];
} State1F8;
extern State1F8 D_801D0770;
u32 func_00201E9C(s32 fmt, u32 w);
void memcpy_aligned(void *dst, void *src, s32 n);
extern inline void func_001FB14C(u8 *p) {
    if (p != ((void *)0)) {
        if (p[0] == 'B' && p[1] == '5') {
            u8 *bank = p;
            u8 *e = *(u8 **)(p + 0x14);
            u32 i;
            for (i = 1; i < bank[3]; i++) {
                u8 *cur = e;
                e = *(u8 **)(cur + 0xC);
                func_000016C4(cur);
            }
        }
        func_000016C4(p);
    }
}
typedef struct SprPart1F8 {
    s16 x;
    s16 y;
    u16 w;
    u16 h;
    u8 unk8[4];
    struct SprPart1F8 *next;
} SprPart1F8;
typedef struct {
    f32 pos[3];
    f32 dir[3];
    f32 scale[3];
    u8 rgba[4];
    s32 on;
    u8 unk2C[4];
} Light1F8;
extern Light1F8 D_801D0774[2];
extern void *D_800C4BB8;
extern u8 D_800E7A0C;
extern u16 *D_800A8204[3];
void func_00019e10(void);
u32 func_00201E9C(s32 fmt, u32 w);
void func_0020019C(void) {
    u8 *s = (D_801D0770.spr);
    SprPart1F8 *p = (SprPart1F8 *)(s + 8);
    s32 ox;
    s32 oy;
    u8 fb[2];
    u16 *dst;
    s32 n;
    u8 *out;
    if (*(u16 *)s != 0x4235) {
        return;
    }
    ox = D_801D0774[0].pos[0];
    oy = D_801D0774[0].pos[1];
    func_00019e10();
    fb[0] = 0;
    fb[1] = 1;
    if (D_800E7A0C == 1) {
        if (D_800C4BB8 == D_800A8204[0]) {
            fb[0] = 1;
            fb[1] = 2;
        } else if (D_800C4BB8 == D_800A8204[1]) {
            fb[0] = 0;
            fb[1] = 2;
        } else if (D_800C4BB8 == D_800A8204[2]) {
            fb[0] = 0;
            fb[1] = 1;
        }
    }
    dst = D_800A8204[fb[0]];
    for (n = 0; n < s[3]; n++) {
        SprPart1F8 *q = p;
        u16 *pix = (u16 *)(p + 1);
        s32 x0 = ox + p->x + 160;
        s32 y0 = -oy + p->y + 120;
        s32 stride = func_00201E9C(2, p->w);
        s32 j;
        for (j = 0; j < q->h; j++) {
            s32 i;
            for (i = 0; i < q->w; i++) {
                s32 xx = x0 + i;
                s32 yy = y0 + j;
                if (xx >= 0 && xx < 320 && yy >= 0 && yy < 240) {
                    dst[yy * 320 + xx] = pix[j * stride + i];
                }
            }
        }
        p = p->next;
    }
    func_001FB14C((D_801D0770.spr));
    out = func_00001330(0x25808);
    out[0] = '6';
    out[1] = '4';
    out[3] = 2;
    (*(u16 *)((u8 *)(out) + (4))) = 320;
    out[2] = 0;
    (*(u16 *)((u8 *)(out) + (6))) = 240;
    memcpy_aligned(out + 8, dst, 0x25800);
    (D_801D0770.spr) = out;
}
