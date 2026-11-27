typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void * func_00001330(unsigned int);
void *D_8009DD38(u32 handle);
extern u8 *D_8022A974;
extern u16 D_8019715E;
extern inline void LoadMenuChunks2A4(u8 k) {
    void **p = func_00001330(12);
    (*(void ** *)((u8 *)(D_8022A974) + (0x14))) = p;
    if (k == 0) {
        p[0] = D_8009DD38(0x1DEE82C);
    } else {
        p[0] = D_8009DD38(0x1DF7BF8);
    }
    p[2] = D_8009DD38(0x1DC873E);
    p[1] = D_8009DD38(0x1DCB92C);
}
void func_002A53F8(u16 *o) {
    o[0] = D_8019715E;
    if (o[0] & 0x200) {
        LoadMenuChunks2A4(1);
    } else {
        LoadMenuChunks2A4(0);
    }
    o[1] = 0xFFFF;
    o[0xE] = 0;
}
