typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8023DE30;
extern s32 D_8023DE40;
extern s32 D_8023DE44;
inline void func_0028FE78(u8 dir) {
    switch (dir) {
        case 4:
            if (D_8023DE40 >= 0x35) {
                D_8023DE30[0x244]--;
                D_8023DE40 -= 60;
            }
            break;
        case 5:
            if (D_8023DE40 < 0x35) {
                D_8023DE30[0x244]++;
                D_8023DE40 += 60;
            }
            break;
        case 6:
            if (D_8023DE44 >= 0x37) {
                D_8023DE30[0x245]--;
                D_8023DE44 -= 72;
            }
            break;
        case 7:
            if (D_8023DE44 < 0x37) {
                D_8023DE30[0x245]++;
                D_8023DE44 += 72;
            }
            break;
    }
}
