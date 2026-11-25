typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
extern u8 *D_801B989C;
void func_001EAE50(void);
s32 func_001CE114(s32 a, s32 w, s32 h);
typedef struct {
    void *name;
    s32 index;
    u8 *buf;
    s32 size;
} Arc16_1E9;
extern Arc16_1E9 D_801BA4E0;
void boot_resource_archive_load_many(void *arc, void *reqs, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
extern inline void ArcInit1E9(Arc16_1E9 *a) {
    *a = D_801BA4E0;
}
void func_001EAE50(void) {
    u8 **slots[8] = { (u8 **)(D_801B989C + 0x18), (u8 **)(D_801B989C + 0x40), (u8 **)(D_801B989C + 0x68), (u8 **)(D_801B989C + 0x90),
                      (u8 **)(D_801B989C + 0xB8), (u8 **)(D_801B989C + 0xE0), (u8 **)(D_801B989C + 0x108), ((void *)0) };
    s16 i;
    for (i = 0; slots[i] != ((void *)0); i++) {
        u8 **e = slots[i];
        Arc16_1E9 arc;
        Arc16_1E9 req;
        s32 size;
        u8 *raw;
        u8 *img;
        ArcInit1E9(&arc);
        ArcInit1E9(&req);
        req.index = i;
        size = D_8009DAF4(0x374CBA);
        raw = func_00001330(size);
        D_8009DBB8(raw, 0x374CBA);
        arc.size = size;
        arc.buf = raw;
        boot_resource_archive_load_many(&arc, &req, 1);
        func_000016C4(raw);
        e[0] = req.buf;
        e[1] = func_00001330(0x20);
        img = e[0];
        memcpy_aligned(e[1], img + (func_001CE114(0, ((u16 *)img)[2], ((u16 *)img)[3]) + 8), 0x20);
    }
}
