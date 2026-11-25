typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void func_0027CEDC(void *fn);
typedef struct Task27 {
    u8 unk00[4];
    u16 state;
    u16 next;
    void (*fn)(s32, struct Task27 *);
    s16 hC;
    s16 hE;
    s16 h10;
    u8 unk12[6];
    s16 x;
    s16 y;
    s16 dx;
    s16 dy;
    s16 h20;
    s16 h22;
    s32 w24;
} Task280;
s32 func_00280B44(u16 msg, Task280 *t);
void func_00280D28(void) {
    func_0027CEDC((void *)func_00280B44);
}
