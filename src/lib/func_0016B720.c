typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_8021EEF4;
extern u8 D_8021EEF8;
extern u8 D_8021EEF9;
extern u8 D_8021EEFA;
extern u8 D_8021EEFB;
extern s32 D_80214F4C;
void func_0016B720(s16 k);
void D_8020CDA0(s32 k);
extern u8 D_800E7A32[];
typedef struct {
    void (*update)(void);
    void (*draw)(void);
    void (*exit)(void);
    u16 size;
} Funcs167;
extern Funcs167 D_800E7A44;
extern u8 D_800E7A33;
extern s32 D_800E7A54;
extern s16 D_800E91D0;
void func_0016BB6C(void);
void func_0016C8B8(void);
typedef struct {
    s16 v[8];
} Rect167;
extern u8 D_800E9C0A[];
u8 *D_8017BFB0(u16, u8, void (*fn)(), s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
void D_8017EF24(s32 a, u16 kind, s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
void *D_8017F36C(u16 id);
void func_0016C98C(void);
typedef struct {
    Rect167 r[3];
} Rects167b;
extern Rects167b D_80220D30;
void func_0016B720(s16 k) {
    Rects167b rc = D_80220D30;
    u8 *flags = D_800E7A32;
    u8 *w;
    u8 *p9;
    D_800E7A44.update = func_0016BB6C;
    D_800E7A44.draw = func_0016C8B8;
    D_800E7A44.size = 0x7C;
    D_800E7A54 = 0;
    D_800E91D0 = k;
    *flags |= 8;
    D_800E7A33 |= 1;
    *flags |= 9;
    D_8021EEF4[0x5C] = 1;
    D_8021EEF4[0x5D] = 0;
    D_8021EEF4[0x5E] = 0;
    p9 = &D_8021EEFA;
    D_8021EEF4[0x5F] = 0;
    D_8021EEF4[0x60] = *p9;
    D_8021EEF4[0x61] = D_8021EEF8;
    D_8021EEF4[0x62] = D_8021EEF9;
    D_8021EEF4[0x63] = *p9;
    D_8021EEF4[0x76] = D_8021EEFB;
    D_8021EEF4[0x77] = 2;
    D_8021EEF4[0x74] = 3;
    D_8021EEF4[0x75] = 0;
    D_80214F4C = 0;
    D_8021EEF4[0x78] = 0;
    D_8021EEF4[0x79] = 0x90;
    w = D_8017BFB0(0x400, 0, func_0016C98C, rc.r[2].v[0], rc.r[2].v[1], rc.r[2].v[2], rc.r[2].v[3],
                      rc.r[2].v[4], rc.r[2].v[5], rc.r[2].v[6], rc.r[2].v[7]);
    (*(u8 * *)((u8 *)(D_8021EEF4) + (0x6C))) = w;
    w[0x23] = 3;
    if (D_800E9C0A[6] != 0) {
        D_8017EF24(0x17082, 0x1100, 0x98, 0xAC, 0xA8, 0xBC, 0x18, 0xA0, 0x128, 0xC8);
        (*(u8 * *)((u8 *)(D_8017F36C(0x1100)) + (0xD0)))[0x5F4] = 2;
        D_8020CDA0(0x10);
    }
}
void func_0016C8B8(void);
