typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
extern s32 D_8018F2F4;
extern s32 D_80190F10;
extern u8 D_0275DD2C[];
void D_8009DA50(u32 rom_address, u8 *destination, u32 bytes);
s32 func_00046694();
s32 func_00046694(s32 mask) {
    if (!D_8018F2F4) {
        D_8009DA50((u32)D_0275DD2C, (u8 *)&D_80190F10, 4);
        D_8018F2F4 = 1;
    }
    return (u8)mask & D_80190F10;
}
