int func_00191174(int i, int lvl);
typedef unsigned char u8;
typedef signed int s32;
extern u8 D_8021B299[];
extern s32 D_801F0B9C;
void bzero(void *p, s32 n);
extern u8 D_8021B330[];
void func_0018F474(void) {
    s32 i;
    bzero(D_8021B330, 9);
    for (i = 0; i < 9; i++) {
        if ((u8)func_00191174(i, 2)) {
            D_8021B330[i] |= 4;
        }
    }
    i = 0;
    if (D_8021B299[D_801F0B9C] == 2) {
        for (i = 0; i < 9; i++) {
            if ((u8)func_00191174(i, 1)) {
                D_8021B330[i] |= 4;
            }
        }
        i = 0;
    }
    do {
        if (D_8021B299[i] == 2 && (u8)func_00191174(D_801F0B9C, 1)) {
            D_8021B330[i] = 4;
        }
        i++;
    } while (i < 9);
    D_8021B330[D_801F0B9C] |= 0x10;
}
