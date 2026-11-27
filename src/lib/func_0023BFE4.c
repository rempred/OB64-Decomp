typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
u16 D_801C8FB8(u8 *u);
int D_8016E230(int, int, int);
int D_8016E458(int);
int D_8016F5E0(int);
unsigned char D_8016E50C(unsigned char *, int, int, int, unsigned char, unsigned short, unsigned short, unsigned short, unsigned short);
s32 D_801BDFBC(u8 cls);
extern u8 D_8018AA81[];
u8 func_0023BFE4(u8 *u) {
    u8 el[4];
    u8 cls;
    u16 item;
    u8 r;
    s32 msg;
    el[0] = *(u16 *)(u + 0x36);
    el[1] = *(u16 *)(u + 0x38);
    el[2] = *(u16 *)(u + 0x3A);
    el[3] = *(u16 *)(u + 0x3C);
    item = D_801C8FB8(u);
    cls = D_8016E230(u[0x4B], (u8)*(s32 *)(u + 0x4C), *(s32 *)(u + 0x4C) == 0x31);
    r = D_8016E458(cls);
    if (item != 0) {
        u[0xA4] = D_8016F5E0(item);
    } else {
        u[0xA4] = 0;
    }
    if (r < 2) {
        if (r == 0) {
            msg = 0x5D;
        } else {
            msg = 0x5E;
        }
        u[0x78] = r;
        *(s32 *)(u + 0x7C) = cls;
    } else {
        u[0x78] = D_8016E50C(&cls, u[0x4B], u[0x4F], cls, u[0x33], el[0], el[1], el[2], el[3]);
        *(s32 *)(u + 0x7C) = cls;
        msg = D_801BDFBC(cls);
        u[0xA4] = D_8018AA81[*(s32 *)(u + 0x7C) * 16];
    }
    return msg;
}
