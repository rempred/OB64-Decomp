typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801F0DE0;
extern u16 D_801E7D62;
extern u16 *D_801AB850;
extern s32 D_801F3658;
extern u8 D_801976DC;
s32 D_801AB0FC(s32, u8);
void func_0010B528(void) {
    u16 a = *D_801AB850;
    u16 v;
    D_801E7D62 = 0x500;
    v = D_801AB0FC(a, 15);
    D_801F0DE0 = 99;
    D_801E7D62 |= v;
    D_801976DC = D_801F3658;
    D_801F3658 = -1;
}
