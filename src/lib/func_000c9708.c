typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000c9708(s32 n, u8 *src) {
    s32 i;
    for (i = 0; i < n; i++) {
        u8 *d = D_80196AF8 + 0x1E08 + i * 6;
        d[0] = *src++;
        d[1] = *src++;
        d[2] = *src++;
        d[3] = *src++;
        (*(u16 *)((u8 *)(d) + (4))) = *src++;
    }
}
