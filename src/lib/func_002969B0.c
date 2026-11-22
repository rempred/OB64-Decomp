typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(u32 size);
void bzero(void *p, s32 n);
typedef struct {
    void *unk00;
    u8 *pixels;
    u8 *tex;
    void *chunk0C;
    void *sprite;
    void *chunk14;
} Res28;
extern Res28 *D_8023DE34;
void bzero(void *p, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void bzero(void *p, s32 n);
u8 func_00295E20(s32 a, u8 *p, s32 b);
struct Panel;
struct PanelContent;

struct PanelContent *func_002969B0(struct Panel *panel, s32 kind, void *src, unsigned short selection) {
    u8 *o = (u8 *)panel;
    u8 *p;
    (void)selection;
    *(u8 **)(o + 0xD0) = func_00001330(0x604);
    bzero(*(u8 **)(o + 0xD0), 0x604);
    p = *(u8 **)(o + 0xD0);
    p[0x5F3] = 0x3F;
    p[0x5F6] = 0xF;
    *(s32 *)(p + 0x600) = kind;
    p[0x5F0] = 0;
    p[0x5FE] = 2;
    bzero(p, 0x500);
    memcpy_aligned(p, src, 0x500);
    o[0x25] = 0;
    switch ((u32)(kind & 0xFF)) {
        case 13:
            p[0x5F4] = 1;
            break;
        case 12:
        case 18:
            p[0x5F4] = 7;
            break;
    }
    ((u8 *)D_8023DE34)[0x64] = 0;
    p[0x5F5] = func_00295E20(0, p, 0);
    return (struct PanelContent *)p;
}
