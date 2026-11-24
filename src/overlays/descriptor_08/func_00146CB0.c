typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 flags;
    u8 unk04[0x6C];
    s32 unk70;
} MapUnit;
extern MapUnit *D_801F0CB0[];
void func_00145D9C(s32 v);
s32 func_00145280(s32 cls);
extern u8 *D_801FCD2C[];
s32 func_00145280(s32);
extern s32 D_801F3658;
extern u8 *D_801FCD2C[];
void func_00146CB0(void *unit, void *src) {
    s32 table;
    u16 flags;
    u8 bits;
    void *sub;
    if ((*(u8 *)((u8 *)(unit) + (1))) & 1) {
        flags = (*(u16 *)((u8 *)(src) + (4)));
        sub = unit + 0x38;
        if (flags & 8) {
            if (flags & 0x10) {
                (*(s8 *)((u8 *)(unit) + (0x48))) = 3;
            } else {
                (*(s8 *)((u8 *)(unit) + (0x48))) = 2;
            }
        } else if (flags & 0x8000) {
            (*(s8 *)((u8 *)(unit) + (0x48))) = 1;
        } else {
            (*(s8 *)((u8 *)(unit) + (0x48))) = 0;
        }
        if (!((*(u16 *)((u8 *)(src) + (4))) & 0x4000)) {
            (*(u8 *)((u8 *)(sub) + (0x13))) = (u8) (*(u8 *)((u8 *)(src) + (8)));
            (*(u8 *)((u8 *)(sub) + (0x14))) = (u8) (*(u8 *)((u8 *)(src) + (9)));
            (*(u8 *)((u8 *)(sub) + (0x15))) = (u8) (*(u8 *)((u8 *)(src) + (0xA)));
            (*(u8 *)((u8 *)(sub) + (0x16))) = (u8) (*(u8 *)((u8 *)(src) + (0xB)));
        }
        {
            u8 *r = (u8 *)unit + (*(u8 *)((u8 *)(unit) + (0xC))) * 0x14;
            (*(s32 *)((u8 *)(sub) + (8))) = (*(s32 *)((u8 *)(r) + (0x10)));
        }
        {
            u8 *r = (u8 *)unit + (*(u8 *)((u8 *)(unit) + (0xC))) * 0x14;
            (*(s32 *)((u8 *)(sub) + (0xC))) = (*(s32 *)((u8 *)(r) + (0x14)));
        }
        (*(s8 *)((u8 *)(sub) + (0x12))) = func_00145280((*(u8 *)((u8 *)(unit) + (2))));
        table = (s32)D_801FCD2C[(*(u8 *)((u8 *)(unit) + (5)))];
        bits = (*(u8 *)((u8 *)(sub) + (0x11))) & 0xF8;
        (*(u8 *)((u8 *)(sub) + (0x11))) = bits;
        if ((*(u8 *)((u8 *)((((*(u8 *)((u8 *)(unit) + (6))) * 2) + table)) + (1))) & 0x80) {
            (*(u8 *)((u8 *)(sub) + (0x11))) = (u8) (bits | 1);
        }
        if ((*(u8 *)((u8 *)((((*(u8 *)((u8 *)(unit) + (6))) * 2) + table)) + (1))) & 0x40) {
            (*(u8 *)((u8 *)(sub) + (0x11))) = (u8) ((*(u8 *)((u8 *)(sub) + (0x11))) | 2);
        }
        if ((D_801F3658 != -1) && ((*(s32 *)((u8 *)(src) + (0))) == ((s32 *)D_801F0CB0)[D_801F3658])) {
            (*(u8 *)((u8 *)(sub) + (0x11))) = (u8) ((*(u8 *)((u8 *)(sub) + (0x11))) | 4);
        }
        func_00145D9C((s32) sub);
    }
}
