typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct Node {
    struct Node *prev;
    struct Node *next;
    u8 unk08[0xE];
    u16 id;
} Node;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_80187020;
typedef struct {
    u8 unk00[0x2C];
    s32 x;
    s32 y;
} WinLabel514;
typedef struct {
    u8 unk000[0x600];
    u32 status;
} UnitLabel514;
void func_00052ae8(WinLabel514 *w, UnitLabel514 *o);
extern void (*D_8018FE18[])(u8 *s, s32 x, s32 y);
void func_000577a0(s32 x, s32 y);
s32 func_00057398(u8 *p, s32 i);
void func_00054b84(Node *n, s32 k) {
    s32 a = (*(s16 *)((u8 *)(n) + (0x18 + k * 2)));
    s32 x;
    s32 y;
    u8 *s;
    s32 dy;
    s32 i;
    if (a != 0) {
        x = (*(s32 *)((u8 *)(n) + (0x2C)));
        y = (*(s32 *)((u8 *)(n) + (0x30)));
        s = (*(u8 * *)((u8 *)(n) + (0xD0)));
        dy = (*(s8 *)((u8 *)(n) + (0x22))) * s[0x5F6] + 6;
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFA000000;
            _g->w1 = a | ~0xFF;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE3000C00;
            _g->w1 = 0;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE3001201;
            _g->w1 = 0;
        }
        if (a == 0xFF) {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x0F0A7008;
        } else {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x504240;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFC119623;
            _g->w1 = 0xFF2FFFFF;
        }
        for (i = 0; i < s[0x5F4]; i++) {
            if (s[0x5F1] + i < s[0x5F5]) {
                D_8018FE18[D_80187020]((u8 *)func_00057398((u8 *)n, s[0x5F1] + i), x + 0x18,
                                                             (y + 4) + i * s[0x5F6]);
            }
        }
        func_000577a0(x + 3, y + dy);
        func_00052ae8((WinLabel514 *)n, (UnitLabel514 *)s);
    }
}
void func_00054b84(Node *n, s32 k);
s32 func_00057398(u8 *p, s32 i);
