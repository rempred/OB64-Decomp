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
} Arc16_1CE070;
extern Arc16_1CE070 D_801B99A0;
void func_0000A510(void *dst, void *src);
void boot_resource_archive_load_many(void *arc, void *reqs, s32 n);
void *func_001CEBE0(s32 id, s32 k, s32 *outSize) {
    s32 *index = func_00001330(D_8009DAF4(id));
    s32 size;
    u8 *raw;
    void *out;
    raw = (u8 *)index;
    D_8009DBB8(raw, id);
    {
        s32 e = index[k];
        func_000016C4(raw);
        size = D_8009DAF4(e);
        raw = func_00001330(size);
        D_8009DBB8(raw, e);
    }
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        Arc16_1CE070 arc = D_801B99A0;
        Arc16_1CE070 req = D_801B99A0;
        arc.buf = raw;
        arc.size = size;
        boot_resource_archive_load_many(&arc, &req, 1);
        out = req.buf;
        size = req.size;
    } else {
        size = func_0000ABE0(raw);
        out = func_00001330(size);
        func_0000A510(out, raw);
    }
    if (outSize != ((void *)0)) {
        *outSize = size;
    }
    func_000016C4(raw);
    return out;
}
