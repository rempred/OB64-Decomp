typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern StockEntry D_80196B00[];
int D_8016B6FC(int);
void func_00131B50(u16 v) {
    s32 i;
    if (v != 0) {
        i = (unsigned short)D_8016B6FC((unsigned short)(v));
        if (i == 0x1FF) {
            for (i = 0; i < 0x116; i++) {
                if (D_80196B00[i].id == 0) {
                    D_80196B00[i].id = v;
                    D_80196B00[i].equipped++;
                    D_80196B00[i].count++;
                    break;
                }
            }
        } else {
            D_80196B00[i].equipped++;
            D_80196B00[i].count++;
        }
        if (D_80196B00[i].count >= 100) {
            D_80196B00[i].count = 99;
        }
        if (D_80196B00[i].equipped >= 100) {
            D_80196B00[i].equipped = 99;
        }
    }
}
