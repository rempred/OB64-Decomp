typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0xD0];
    u8 bD0;
} Ent23B;
Ent23B *D_801C8FE8(s16 a);
s32 D_801E7410(s32 a);
s32 D_801DF2AC(u8 *p, s32 a, s32 b);
void D_801AD9D4(u8 *p, s16 a);
extern u8 (*D_801D0738)[3];
extern u8 D_801B3EE0[];
void func_0023B274(s16 k, s32 t) {
    Ent23B *e = D_801C8FE8(k);
    u32 i;
    if (D_801E7410((*(s32 *)((u8 *)(e) + (0x80)))) != 0 || k == 1) {
        (*(s32 *)((u8 *)(e) + (0x88))) = t;
        for (i = 0; i < 3; i++) {
            if ((*(u8 ** *)((u8 *)(e) + (i * 4))) != ((void *)0)) {
                *(*(void ** *)((u8 *)(e) + (i * 4))) = D_801B3EE0;
            }
        }
    } else {
        (*(s32 *)((u8 *)(e) + (0xA0))) = 10;
        (*(s32 *)((u8 *)(e) + (0x88))) = D_801DF2AC((*(u8 * *)((u8 *)(e) + (0))) + 0x44, 0x11, 0) + t;
        for (i = 0; i < 3; i++) {
            if ((*(u8 * *)((u8 *)(e) + (i * 4))) != ((void *)0)) {
                (*(s16 *)((u8 *)((*(u8 * *)((u8 *)(e) + (i * 4)))) + (0x2E))) = D_801D0738[e->unk00[0xA4]][0];
                (*(s16 *)((u8 *)((*(u8 * *)((u8 *)(e) + (i * 4)))) + (0x30))) = D_801D0738[e->unk00[0xA4]][1];
                (*(s16 *)((u8 *)((*(u8 * *)((u8 *)(e) + (i * 4)))) + (0x32))) = D_801D0738[e->unk00[0xA4]][2];
                D_801AD9D4((*(u8 * *)((u8 *)(e) + (i * 4))) + 0x44, 0x11);
            }
        }
    }
    e->unk00[0xA7] = (*(s32 *)((u8 *)(e) + (0x88))) / 2;
}
