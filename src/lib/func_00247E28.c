typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *func_000016C4(void *ptr);
typedef struct {
    s32 arg;
    u8 unk004[4];
    void *data;
    u8 unk00C[2];
    s16 xE;
    s16 x10;
    u8 unk012[2];
    f32 px;
    f32 py;
    u8 unk01C[0x8CC];
    void *path;
    s16 step;
    u8 unk8EE[6];
} Work244;
extern u8 D_801D7D60[];
extern Work244 D_801D7EE0;
void bzero(void *p, s32 n);
void func_00247E28(void);
typedef struct {
    u32 type;
    u8 unk04[8];
    void *buf;
    u8 unk10[0xC];
    void *buf2;
    u8 unk20[0x40];
} Slot244;
extern Slot244 D_801D7EFC[20];
extern u8 D_801D867C[20][0x10];
extern void *D_801D87D0;
extern void *D_801D7EE8;
void D_801C234C(void);
void D_801C1A9C(void);
void D_801C1D98(void);
void func_00247E28(void) {
    u32 i;
    s32 j;
    Slot244 *s;
    for (i = 0; i < 20; i++) {
        Slot244 *s = &D_801D7EFC[i];
        if (s->type == 0) {
        } else if (s->type < 3) {
        } else if (s->type == 3) {
            func_000016C4(s->buf2);
        }
        func_000016C4(s->buf);
        bzero(s, 0x60);
    }
    for (i = 0; i < 20; i++) {
        bzero(D_801D867C[i], 0x10);
    }
    func_000016C4(D_801D87D0);
    func_000016C4(D_801D7EE8);
    for (j = 0; j < 32; j++) {
        func_000016C4(((void **)D_801D7D60)[j]);
    }
    bzero(D_801D7D60, 0x180);
    D_801C234C();
    D_801C1A9C();
    D_801C1D98();
    bzero(&D_801D7EE0, 0x8F4);
}
