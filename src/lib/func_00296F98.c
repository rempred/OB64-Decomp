typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void func_00294E04(void *p);
void D_8017C4B4(u32);
void D_801793AC(s32 a, s32 x, s32 y);
void func_00291194(s32 k, u8 *o);
void func_00291194(s32 a, u8 *o);
void func_00296F98(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        func_00294E04((*(void * *)((u8 *)(o) + (0xD0))));
        D_8017C4B4(e[0xC]);
        D_801793AC((*(s32 *)((u8 *)((*(u8 * *)((u8 *)(o) + (0xD0)))) + (0x530))), (*(s32 *)((u8 *)(o) + (0x2C))) + 4, (*(s32 *)((u8 *)(o) + (0x30))) + 4);
        func_00291194(1, o);
    }
}
