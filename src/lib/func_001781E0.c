typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80218D80;
extern void *D_80218D84;
extern u8 D_80193BD1[][0x38];
extern void *D_8021CA70;
void *D_8016FBE0(u8 cls, u8, void * *);
void *D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
void func_00177F00();
typedef struct {
    u8 pad0[0x18];
    s16 alpha[5];
    s8 id;
    u8 pad23[0x2C - 0x23];
    s32 x;
    s32 y;
} Win177;
void func_00177F00(Win177 *w, s32 k);
void func_001781E0(s32 id) {
    D_80218D84 = D_8016FBE0(D_80193BD1[(u8)id][0], 0, &D_8021CA70);
    D_80218D80 = D_8017BFB0(0, 0, func_00177F00, 0x9C, 0x9C, 0xA4, 0xA4, 0x44, 0x82, 0xFC, 0xBE);
    D_80218D80[0x22] = id;
}
