typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8021EEF4;
s32 D_801E00F0(s32 a, s32 b, s32 c, s32 d, s32 e, s32 f);
void D_8020CDA0(s32 k);
void func_0016C838(void) {
    u8 r = D_801E00F0(D_8021EEF4[0x75], 0, 0, 0, 2, 0x78);
    if (r == 1) {
        D_8021EEF4[0x5D] = 0x81;
        D_8020CDA0(6);
    } else if (r == 3) {
        D_8021EEF4[0x5D] = 0x82;
        D_8020CDA0(1);
    }
}
