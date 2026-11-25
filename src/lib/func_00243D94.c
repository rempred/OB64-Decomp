typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
void *func_00001330(s32 size);
s32 func_002436F4(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq20F;
extern Seq20F *D_801F0550;
void bzero(void *p, s32 n);
void func_00019e10(void);
s32 func_002436F4(s32 type, u16 w, u16 h, u8 *data, u8 a, u8 b);
typedef struct {
    u8 unk00[0x84];
    u8 *data;
    u8 unk88[0x100];
    s32 size;
} BgJob_20FDC0;
s32 func_00243D94(u8 *data, u8 a, u8 b) {
    u8 *p = data;
    s8 type = p[2];
    u16 w = *(u16 *)(p + 4);
    u16 h = *(u16 *)(p + 6);
    u8 *q;
    u8 *r;
    func_00019e10();
    p += 8;
    if (*(u16 *)data == 0x4855) {
        func_002436F4(type, w, h, p, a, b);
        return 0;
    } else {
        D_801F0550 = func_00001330(0x190);
        bzero(D_801F0550, 0x190);
        ((u8 *)D_801F0550)[0x7E] = 0;
        ((BgJob_20FDC0 *)D_801F0550)->data = data;
        ((u8 *)D_801F0550)[0x81] = 1;
        ((BgJob_20FDC0 *)D_801F0550)->size = 0;
        ((u8 *)D_801F0550)[0x82] = a;
        ((BgJob_20FDC0 *)D_801F0550)->size = 8;
        r = p;
        p += 0x10;
        ((BgJob_20FDC0 *)D_801F0550)->size = *(u16 *)(r + 4) * *(u16 *)(r + 6) * 2 + 0x18;
        q = p;
        p += 8;
        func_002436F4((s8)q[2], *(u16 *)(q + 4), *(u16 *)(q + 6), p, 0, 1);
        return 1;
    }
}
