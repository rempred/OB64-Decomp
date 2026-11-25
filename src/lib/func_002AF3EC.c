typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_8022A974;
void func_002AF3EC(s32 idx, s32 v) {
    s16 i;
    s16 s;
    s16 end;
    if (idx == -1) {
        s = 0;
        end = 28;
    } else {
        s = idx;
        end = idx + 1;
    }
    for (i = s; i < end; i++) {
        u8 *u = ((u8 **)(D_8022A974 + 0x18))[i];
        if (u != ((void *)0)) {
            u[0x13E] = v;
        }
    }
}
