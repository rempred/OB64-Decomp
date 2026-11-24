typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
void *func_00001330(unsigned int);
void *func_000016C4(void *ptr);
extern u16 *D_8019A798;
extern void *D_8019A790;
extern void *D_8019A794;
void bcopy(void *src, void *dst, s32 n);
void func_0006e810(void) {
    u16 *tmp = func_00001330(D_8009DAF4(0x315736));
    u32 o;
    D_8009DBB8(tmp, 0x315736);
    D_8019A798 = func_00001330(tmp[0x16 / 2]);
    bcopy(tmp, D_8019A798, tmp[0x16 / 2]);
    o = D_8019A798[0];
    D_8019A790 = (u8 *)D_8019A798 + o;
    o = D_8019A798[2];
    D_8019A794 = (u8 *)D_8019A798 + o;
    func_000016C4(tmp);
}
