typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s32 w[20];
} Pose24;
u8 *D_801C8FE8(u32 i);
void D_801ADCBC(u8 *e);
void func_0024179C(void) {
    s32 i;
    u32 j;
    u8 *e;
    for (i = 0; i < 3; i++) {
        e = D_801C8FE8(i);
        if (e == ((void *)0) || e[0xA5] == 0) {
            continue;
        }
        D_801ADCBC(e);
        for (j = 0; j < 3; j++) {
            u8 *a = ((u8 **)e)[j];
            if (a != ((void *)0)) {
                u8 *b = ((u8 **)e)[j + 3];
                if (b != ((void *)0)) {
                    *(Pose24 *)(b + 0x44) = *(Pose24 *)(a + 0x44);
                }
            }
        }
        if ((*(s32 *)((u8 *)(e) + (0xA0))) != 0 && --(*(s32 *)((u8 *)(e) + (0xA0))) == 0) {
            for (j = 0; j < 3; j++) {
                u8 *a = ((u8 **)e)[j];
                if (a != ((void *)0)) {
                    (*(s16 *)((u8 *)(a) + (0x32))) = 0;
                    (*(s16 *)((u8 *)(a) + (0x30))) = 0;
                    (*(s16 *)((u8 *)(a) + (0x2E))) = 0;
                }
            }
        }
    }
}
