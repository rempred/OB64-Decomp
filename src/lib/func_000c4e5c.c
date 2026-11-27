typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
void func_000c4e5c(u8 *o, s16 *list, s16 x, s16 y) {
    s32 n;
    (*(s16 * *)((u8 *)(o) + (0))) = list;
    (*(s16 *)((u8 *)(o) + (4))) = x;
    (*(s16 *)((u8 *)(o) + (6))) = y;
    o[8] = 0;
    n = 0;
    while (list[0] != 0 || list[1] != 0) {
        list += 3;
        n++;
        (o + n)[8] = 0;
    }
    if (n >= 48) {
        n = 47;
    }
    (*(s32 *)((u8 *)(o) + (0x38))) = n;
    (*(s32 *)((u8 *)(o) + (0x3C))) = 0;
}
