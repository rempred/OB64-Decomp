typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
u8 D_8016DBD8(u8 cls, u8 lv);
f32 D_8021802C(f32 t, s32 n, void *a, void *b, void *c);
s32 func_0023BE34(u8 *u) {
    u32 i;
    for (i = 0; i < 3; i++) {
        u8 *a;
        u8 *b;
        if (!((u[0xA6] >> i) & 1)) {
            continue;
        }
        a = ((u8 **)u)[i];
        b = ((u8 **)u)[i + 3];
        if ((a != ((void *)0)) & (b != ((void *)0))) {
            if (D_8016DBD8(u[0x4B], u[0x4F]) != 1) {
                (*(f32 *)((u8 *)(a) + (0xA8))) += (*(f32 *)((u8 *)(a) + (0xB0)));
                (*(s16 *)((u8 *)(a) + (0x1C))) = (*(f32 *)((u8 *)(a) + (0xA0))) + (*(f32 *)((u8 *)(a) + (0xA8)));
                (*(s32 *)((u8 *)(a) + (4))) = (*(s16 *)((u8 *)(a) + (0x1C))) * 30;
                (*(s16 *)((u8 *)(b) + (0x1C))) = (*(s16 *)((u8 *)(a) + (0x1C)));
            } else {
                s32 *c;
                s32 n;
                if ((*(s32 *)((u8 *)(u) + (0x8C))) == 1) {
                    *(*(s32 * *)((u8 *)(a) + (0xBC))) = 0;
                    return 1;
                }
                (*(f32 *)((u8 *)(a) + (0xA8))) += (*(f32 *)((u8 *)(a) + (0xB0)));
                (*(s16 *)((u8 *)(a) + (0x1C))) = (*(f32 *)((u8 *)(a) + (0xA0))) + (*(f32 *)((u8 *)(a) + (0xA8)));
                (*(s32 *)((u8 *)(a) + (4))) = (*(s16 *)((u8 *)(a) + (0x1C))) * 30;
                n = (*(*(s32 * *)((u8 *)(a) + (0xBC))))++;
                c = (*(s32 * *)((u8 *)(a) + (0xBC)));
                (*(s16 *)((u8 *)(a) + (0x1E))) = D_8021802C(n, c[1], c + 3, c + 13, c + 23);
                (*(s32 *)((u8 *)(a) + (8))) = (*(s16 *)((u8 *)(a) + (0x1E))) * 30;
                (*(s16 *)((u8 *)(b) + (0x1C))) = (*(s16 *)((u8 *)(a) + (0x1C)));
            }
        }
    }
    return 0;
}
