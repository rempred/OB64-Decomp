typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct DrawImage DrawImage;

void *func_001F0A9C(s32 id);
int func_001F3C00(void *input, int setup, int mode, DrawImage *optional,
                  int xOffset, int yOffset);
s32 func_001F70CC(u8 *o) {
    u8 *p = o;
    DrawImage *v;
    if ((*(u32 *)((u8 *)(o) + (0x94))) & 4) {
        v = func_001F0A9C(0x3224BA);
    } else {
        v = 0;
    }
    func_001F3C00(o, p[0x14] != 3, (*(u32 *)((u8 *)(p) + (0x94))) & 2, v, 0, 0);
    return 1;
}
