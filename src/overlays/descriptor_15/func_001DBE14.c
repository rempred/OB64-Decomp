typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 D_801BA6E1;
extern void *D_801BA550;
extern u8 *D_801BA554;
extern s32 *D_801BA558;
extern s32 *D_801BA55C;
extern s32 D_801BA6EC;
void func_001DB690(u8 *w, s32 i);
void *D_8017C074(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h);
void func_001DAECC();
void func_001DB800(void);
extern void *D_801BA550;
extern u8 *D_801BA554;
extern s32 *D_801BA558;
extern s32 *D_801BA55C;
extern s32 D_801BA6EC;
s32 func_001DBE14(void) {
    switch (D_801BA6EC) {
        case 0:
            D_801BA6E1 = 1;
            D_801BA6EC = 1;
            break;
        case 1:
            D_8017C074(0, 0, func_001DB690, 0x20, 0x20, 0x120, 0x3A);
            D_8017C074(0x400, 0, func_001DAECC, 0x20, 0x44, 0x120, 0xD0);
            *D_801BA554 = 1;
            D_801BA6EC++;
            break;
        case 2:
            func_001DB800();
            break;
    }
    D_801BA558 = D_801BA55C + (*(s32 *)((u8 *)(D_801BA550) + (0xC)));
    return 0;
}
