typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801F0DE0;
extern u16 D_801E7D62;
extern u16 *D_801AB850;
s32 D_801AB0FC(s32, u8);
void func_0010C73C(void) {
    u16 a = *D_801AB850;
    u16 v;
    D_801E7D62 = 0x100;
    v = D_801AB0FC(a, 15);
    D_801F0DE0 = 99;
    D_801E7D62 |= v;
}
