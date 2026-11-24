void func_000b4bb8(void);
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000b48f0(s32 a, s32 b, s32 c);
u8 *D_801CC410(s32 id);
void bzero(void *p, s32 n);
extern u8 D_80190F81;
extern inline void func_000b4a70(s32 a) {
    u8 *st = D_80196AF8;
    s32 f;
    if (st[0x98] == 0 || st[0x99] == 1) {
        f = 1;
    } else {
        f = 0;
    }
    func_000b48f0(a, f, 1);
}
u16 func_000bbbf0(u8 *st);
u8 func_000bc258();
extern s32 D_801939DC;
void func_000b67ac(void) {
    switch ((*(s16 *)((u8 *)(D_80196AF8) + (0x122)))) {
        case 0:
            bzero(D_80196AF8 + 0x1BEE, 0x1FE);
            D_80196AF8[0x1DED] = func_000bc258();
            if (D_80190F81 == 0) {
                (*(s16 *)((u8 *)(D_80196AF8) + (0x122))) = 99;
                func_000b4a70(0x40009);
            } else if (D_80196AF8[0x1DED] == 0) {
                (*(s16 *)((u8 *)(D_80196AF8) + (0x122))) = 99;
                func_000b4a70(0x4000E);
            } else {
                (*(s16 *)((u8 *)(D_80196AF8) + (0x122)))++;
            }
            break;
        case 1:
            if (D_80196AF8[0x1DED] > D_80190F81) {
                D_801939DC = func_000bbbf0(D_80196AF8);
                (*(s16 *)((u8 *)(D_80196AF8) + (0x122)))++;
                func_000b4a70(0x4001A);
            } else {
                D_801939DC = func_000bbbf0(D_80196AF8);
                (*(s16 *)((u8 *)(D_80196AF8) + (0x122)))++;
                func_000b4a70(0x40031);
            }
            break;
        case 2:
            if (D_801CC410(0x100) == ((void *)0)) {
                (*(s16 *)((u8 *)(D_80196AF8) + (0x122))) = 99;
            }
            break;
        case 99:
            func_000b4bb8();
            break;
    }
}
