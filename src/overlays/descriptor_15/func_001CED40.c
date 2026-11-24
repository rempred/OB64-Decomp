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
extern inline void ArcInit1CE(Arc16_1CE070 *a) {
    *a = D_801B99A0;
}
void *func_001CED40(s32 id, s32 k) {
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
        Arc16_1CE070 arc;
        Arc16_1CE070 req;
        ArcInit1CE(&arc);
        ArcInit1CE(&req);
        arc.buf = raw;
        arc.size = size;
        boot_resource_archive_load_many(&arc, &req, 1);
        out = req.buf;
    } else {
        out = func_00001330(func_0000ABE0(raw));
        func_0000A510(out, raw);
    }
    func_000016C4(raw);
    return out;
}
