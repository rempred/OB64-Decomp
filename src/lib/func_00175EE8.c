struct Panel;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801F0DE0;
extern u8 D_801F365D;
struct Panel *D_8017F36C(unsigned short id);
void func_00175EE8(void) {
    if (D_8017F36C(0x100) == 0) {
        D_801F0DE0 = 0;
        D_801F365D &= 0xFE;
    }
}
