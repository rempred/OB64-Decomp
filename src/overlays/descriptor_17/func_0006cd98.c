typedef unsigned char u8;
typedef unsigned short u16;
typedef struct {
    u8 b[0x40];
} Rec699;
extern u8 D_8019C8E8;
extern u16 gCardMatrixCount;
Rec699 *func_0006cae0(Rec699 *r);
void func_0006cd98(u8 *o) {
    if (D_8019C8E8 == 0) {
        Rec699 *r = func_0006cae0(&(*(Rec699 * *)((u8 *)(o) + (8)))[gCardMatrixCount]);
        gCardMatrixCount += r - &(*(Rec699 * *)((u8 *)(o) + (8)))[gCardMatrixCount];
    }
}
