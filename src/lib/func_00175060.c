typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_8021AC1C;
extern s32 D_80214F64;
extern u8 D_8021AC18;
extern u8 D_8021AFE7;
void func_00175060(void) {
    D_8021AC1C += 2;
    if ((u32)(D_80214F64 - 8) >= 12) {
        if (D_8021AC1C >= 0x74) {
            D_8021AC1C = 0;
        }
    } else {
        D_8021AC1C = 0x60;
    }
    if (D_80214F64 < 7) {
        if (D_8021AC18 == 0) {
            D_8021AFE7 += 5;
            if (D_8021AFE7 >= 0x78) {
                D_8021AC18 = 1;
            }
        } else {
            D_8021AFE7 -= 5;
            if (D_8021AFE7 < 0x1F) {
                D_8021AC18 = 0;
            }
        }
    }
}
