typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 b[8];
} Col222;
extern u8 *D_801CE8C0;
u8 **D_801C8FE8(s32 i);
s32 D_801C8E30(u8 **u);
void D_8020B1E0(u8 mode, s16 *in, u16 *out);
u8 D_801BC76C(void);
u8 D_801BC838(void);
u8 D_801BC914(void);
void func_00222CA8(s16 id) {
    s32 i;
    u32 j;
    u8 **u;
    u8 *o;
    u16 out[4];
    s16 in[12];
    if (D_801CE8C0 == ((void *)0) || D_801CE8C0[0x822] == 0) {
        return;
    }
    if (D_801CE8C0[0x821] != id) {
        return;
    }
    for (i = 0; i < 20; i++) {
        u = D_801C8FE8(i);
        if (D_801C8E30(u) != 0) {
            continue;
        }
        for (j = 0; j < 3; j++) {
            o = u[j];
            if (o != ((void *)0)) {
                in[0] = o[0x37];
                in[1] = o[0x38];
                in[2] = o[0x39];
                in[3] = o[0x3A];
                in[5] = o[0x3B];
                in[6] = o[0x3C];
                in[7] = o[0x3D];
                D_8020B1E0(o[0x36], in, out);
                o[0x3B] = out[0];
                o[0x3C] = out[1];
                o[0x3D] = out[2];
                o[0x38] = D_801BC76C();
                o[0x39] = D_801BC838();
                o[0x3A] = D_801BC914();
                o[0x36] = 0;
                o[0x37] = 10;
            }
        }
        if (u[6] != ((void *)0)) {
            *(Col222 *)(u[6] + 0x36) = *(Col222 *)(u[0] + 0x36);
        }
        if (u[7] != ((void *)0)) {
            *(Col222 *)(u[7] + 0x36) = *(Col222 *)(u[0] + 0x36);
        }
    }
    D_801CE8C0[0x822] = 0;
}
