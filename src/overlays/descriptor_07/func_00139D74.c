typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u16 D_80196A2C;
extern u8 D_80196A2E;
extern u8 D_801F0E0C;
extern u8 D_801F0E0D;
s32 func_00139D74(void) {
    return D_80196A2C * 60 + D_80196A2E < D_801F0E0C * 60 + D_801F0E0D;
}
