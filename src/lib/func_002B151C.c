typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_8022A974;
void func_002B118C(void);
void func_002B151C(void) {
    u8 *s = D_8022A974;
    u8 *t = (*(u8 * *)((u8 *)(s) + (0x1BB0)));
    s32 i;
    if (t != ((void *)0)) {
        for (i = 0; i < 20; i++) {
            u8 *e = ((u8 **)(s + 0x1C54))[i];
            (*(f32 *)((u8 *)(e) + (0x48))) += ((f32 *)(t + 0xA4))[i * 2];
            (*(f32 *)((u8 *)(e) + (0x4C))) += ((f32 *)(t + 0xA8))[i * 2];
            (*(f32 *)((u8 *)(e) + (0x40))) += ((f32 *)(t + 0x144))[i * 2];
            (*(f32 *)((u8 *)(e) + (0x44))) += ((f32 *)(t + 0x148))[i * 2];
            (*(f32 *)((u8 *)(e) + (0x50))) += ((f32 *)(t + 0x1E4))[i];
            (*(f32 *)((u8 *)(e) + (0x54))) += ((f32 *)(t + 0x234))[i];
        }
        if (--(*(s32 *)((u8 *)(t) + (0x284))) == 0) {
            func_002B118C();
        }
    }
}
