typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *D_8009DD38(u32 handle);
typedef struct {
    u16 next;
    u8 unk02[2];
    s32 w4;
    s32 w8;
    s32 wC;
    s16 h10;
    u8 unk12[0x66];
} Blk78;
extern Blk78 *D_8021E3CC;
extern void *D_8021E3D0;
void func_001AB72C(void) {
    D_8021E3CC = D_8009DD38(0x1DF7BF8);
    D_8021E3D0 = D_8009DD38(0x1DC2EE8);
}
