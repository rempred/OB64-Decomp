typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
void * func_00001330(unsigned int);
extern s32 *D_801BA6B0;
extern s16 *D_801BA6B4;
extern u8 *D_801BA6B8;
extern u8 *D_801BA6BC;
void func_001EA0B8(void) {
    u8 *p = func_00001330(D_8009DAF4(0x315736));
    s32 a;
    s32 b;
    s32 c;
    D_8009DBB8(p, 0x315736);
    a = (*(u16 *)((u8 *)(p) + (0xC)));
    b = (*(u16 *)((u8 *)(p) + (0x12)));
    c = (*(u16 *)((u8 *)(p) + (0x14)));
    D_801BA6B0 = (s32 *)p;
    D_801BA6BC = (u8 *)((s32)p + a);
    D_801BA6B4 = (s16 *)((s32)p + b);
    D_801BA6B8 = (u8 *)((s32)p + c);
}
