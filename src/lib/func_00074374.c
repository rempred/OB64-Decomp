typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8019780C;
typedef struct {
    s16 h[13];
} Rec712;
void *D_80074AD4(s32 k);
void func_00074374(void) {
    Rec712 *r;
    r = D_80074AD4(0);
    if (r != ((void *)0)) {
        *(Rec712 *)(D_8019780C + 0x264) = *r;
    } else {
        D_8019780C[0x264] = 0xFF;
    }
    func_000016C4(r);
    r = D_80074AD4(1);
    if (r != ((void *)0)) {
        *(Rec712 *)(D_8019780C + 0x27E) = *r;
    } else {
        D_8019780C[0x27E] = 0xFF;
    }
    func_000016C4(r);
}
