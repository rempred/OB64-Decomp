typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(u8 *p);
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
typedef struct {
    void *name;
    s32 index;
    u8 *buf;
    s32 size;
} Arc16_23D;
extern Arc16_23D D_801F0490;
void func_0000A510(void *dst, void *src);
void boot_resource_archive_load_many(void *arc, void *reqs, s32 n);
void D_801EFB24(u8 *data, s32 a, s32 b);
void *D_801EFC78(void);
void *func_0023D090(s32 id) {
    s32 size = D_8009DAF4(id);
    u8 *raw = func_00001330(size);
    void *out;
    D_8009DBB8(raw, id);
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        Arc16_23D arc = D_801F0490;
        Arc16_23D req = D_801F0490;
        arc.size = size;
        arc.buf = raw;
        boot_resource_archive_load_many(&arc, &req, 1);
        func_000016C4(raw);
        out = req.buf;
    } else if (raw[0] == 'H' && raw[1] == 'U') {
        D_801EFB24(raw, 1, 0);
        out = D_801EFC78();
    } else if (raw[0] == 'B' && raw[1] == '5') {
        D_801EFB24(raw, 1, 0);
        out = D_801EFC78();
    } else {
        out = func_00001330(func_0000ABE0(raw));
        func_0000A510(out, raw);
        func_000016C4(raw);
    }
    return out;
}
