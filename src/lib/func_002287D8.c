void bzero(void *memory, unsigned int bytes);
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u16 c[4];
} Col224;
extern Col224 D_801E6228[];
typedef struct {
    s32 mode;
    u8 c[4];
    u8 b8;
    u8 b9;
    u8 bA;
    u8 bB;
    u8 padC[0x3C];
    u32 step;
} Glow224;
void func_002287D8(u16 msg, u8 *o, Glow224 *a) {
    u32 i;
    switch (msg) {
        case 0:
            bzero(a, 0x4C);
            for (i = 0; i < 5; i++) {
                ((s32 *)a)[i * 3] = -1;
            }
            a->mode = 5;
            a->bA = 0x38;
            a->b8 = 0;
            a->b9 = 0;
            a->bB = 8;
            a->step = 0;
            break;
        case 0x80:
            a->c[0] = D_801E6228[a->step].c[0];
            a->c[1] = D_801E6228[a->step].c[1];
            a->c[2] = D_801E6228[a->step].c[2];
            a->c[3] = D_801E6228[a->step].c[3];
            if (++a->step >= 29) {
                a->step = 10;
                (*(u16 *)((u8 *)(o) + (0x20))) = 0x8A;
            }
            break;
        case 0x8A:
            if ((s32)--a->step < 0) {
                (*(u16 *)((u8 *)(o) + (0x20))) = 1;
            }
            break;
    }
}
