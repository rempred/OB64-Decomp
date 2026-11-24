typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    void *data;
    s16 h4;
} Grid29;
typedef struct {
    u8 from[3];
    u8 to[3];
    s16 h6;
    s16 h8;
    s16 hA;
} Pair29;
typedef struct {
    u8 unk0000[0x168];
    void *p168[0x38];
    Pair29 *p248[0x5BF];
    void *p1944[0x1C];
    u8 unk19B4[0x94];
    Grid29 *grid;
    u8 unk1A4C[0x168];
    void *p1BB4[20];
} Battle29;
extern Battle29 *D_8022A974;
s32 D_801BEA0C(s32 fmt, s32 w);
u16 D_801BEB28(u16 c);
u32 D_801BEA70(u32 c);
extern u8 D_8018FC19;
extern inline void SepiaImg29(void *pix, s32 fmt, s32 h, s32 w) {
    s32 n;
    s32 i;
    n = D_801BEA0C(fmt, w);
    n *= h;
    if (fmt == 2) {
        u16 *p = pix;
        for (i = 0; i < n; i++, p++) {
            *p = D_801BEB28(*p);
        }
    } else if (fmt == 3) {
        u32 *p = pix;
        for (i = 0; i < n; i++, p++) {
            *p = D_801BEA70(*p);
        }
    }
}
extern inline void SepiaBank29(u8 *bank) {
    u8 *e = bank + 8;
    s32 k;
    for (k = 0; k < bank[3]; k++) {
        u8 *hdr = e;
        SepiaImg29(hdr + 0x10, 2, (*(u16 *)((u8 *)(hdr) + (6))), (*(u16 *)((u8 *)(hdr) + (4))));
        e = (*(u8 * *)((u8 *)(hdr) + (0xC)));
    }
}
extern inline void SepiaOne29(u8 *img) {
    u8 *hdr = img;
    img += 8;
    SepiaImg29(img, hdr[3], (*(u16 *)((u8 *)(hdr) + (6))), (*(u16 *)((u8 *)(hdr) + (4))));
}
extern u8 *D_801D0770;
extern u8 *volatile D_801D07A0;
void D_801C45E0(void);
void D_801C22D0(s32 a);
void func_0029B5A4(void);
void func_0029AF24(void) {
    s32 k;
    if (D_8018FC19 == 2) {
        if (D_801D0770[0] == 0x36 && D_801D0770[1] == 0x34) {
            SepiaOne29(D_801D0770);
        } else {
            SepiaBank29(D_801D0770);
        }
        if (D_801D07A0 != ((void *)0)) {
            SepiaBank29(D_801D07A0);
        }
    } else {
        for (k = 0; k < 20; k++) {
            if ((*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4))) != ((void *)0)) {
                if ((*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4)))[0] == 0x36 && (*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4)))[1] == 0x34) {
                    SepiaOne29((*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4))));
                }
                if ((*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4)))[0] == 0x37 && (*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4)))[1] == 0x34) {
                    SepiaOne29((*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4))));
                } else {
                    SepiaBank29((*(u8 * *)((u8 *)(D_8022A974) + (0x1C04 + (k) * 4))));
                }
            }
        }
    }
    D_801C45E0();
    D_801C22D0(1);
    func_0029B5A4();
}
void func_0029B5A4(void);
