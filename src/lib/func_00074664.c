struct NUContPakFile;
void func_0001b2e0(struct NUContPakFile *file, unsigned char *noteName, unsigned char *extName);
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef signed char s8;
extern u8 *D_8019780C;
void func_0001aaa0(void);
void func_0001aac0(void);
void func_0001afd0(struct NUContPakFile *, u32);
void func_0001b240(u8 *, u8 *);
void func_0002C950(s8 *, s8 *);
s32 func_00074664(s32 k) {
    s32 r = 0;
    s32 o;
    s32 v;
    (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = 0;
    func_0001aaa0();
    func_0001afd0((struct NUContPakFile *)(D_8019780C + 0x254), 0);
    v = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)));
    if (v != 0) {
        (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = v;
        r = v == 10;
    } else {
        o = k * 32 + 0x54;
        func_0001b240(D_8019780C + o + 8, D_8019780C + o + 4);
        func_0001b2e0((struct NUContPakFile *)(D_8019780C + 0x254), D_8019780C + o + 0xE, D_8019780C + o + 0xA);
        if ((*(s32 *)((u8 *)(D_8019780C) + (0x25C))) != 0) {
            (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)));
        }
        func_0001aac0();
    }
    return r;
}
