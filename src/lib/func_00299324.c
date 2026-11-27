struct Panel;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_8023DE30;
extern u16 D_800E8100;
int func_00299218(struct Panel *);
int func_00299218(struct Panel *);
s32 func_00299324(struct Panel *o) {
    u8 *s = D_8023DE30;
    s32 r = -1;
    if (s[0x23C] == 0) {
        return func_00299218(o);
    }
    if ((*(s16 *)((u8 *)(o) + (0x18))) < 0xDF) {
        (*(s16 *)((u8 *)(o) + (0x18))) += 0x20;
        return -1;
    }
    if (D_800E8100 & 0x8000) {
        do {
            r = 0;
        } while (0);
    } else if ((D_800E8100 & 0x4000) || s[0x23E] != s[0x23D]) {
        r = func_00299218(o);
    }
    return r;
}
