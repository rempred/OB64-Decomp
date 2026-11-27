typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u32 *D_801F0CB0[];
extern s32 D_801F3658;
extern s32 D_801F0DE0;
extern u8 D_801F0FDF;
extern u8 D_801F0FE0;
extern u8 D_801F0FE1;
extern u8 D_801969BA[];
extern void *D_8021B444;
extern struct {
    u16 flags;
    u8 rest[0x22];
} D_801951CC[];
s32 D_801DA228(u32 *u);
u8 func_0019C760(void *w);
s32 D_801DADF0(u32 *u);
s32 D_801DD244(void);
void func_001A286C(void) {
    u32 *u = D_801F0CB0[D_801F3658];
    s32 n;
    s32 loc;
    u16 f;
    if (func_0019C760(D_8021B444)) {
        return;
    }
    D_801F0DE0 = 4;
    D_801F0FE1 = D_801DADF0(u);
    D_801F0FDF = 5;
    n = 2;
    if (!(*u & 0x40)) {
        loc = u[0x74 / 4];
    } else {
        loc = D_801F0CB0[D_801969BA[D_801DA228(u) * 11]][0x74 / 4];
    }
    f = D_801951CC[loc].flags;
    if (f & 0x100) {
        n++;
    } else if (f & 0x200) {
        n++;
    }
    if (D_801DD244()) {
        n = 1;
    }
    D_801F0FE0 = n;
}
