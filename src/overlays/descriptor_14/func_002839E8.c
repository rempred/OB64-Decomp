typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(u8 *p);
void *func_00001330(s32 size);
extern void * resource_alloc_tree_scan(u32);
void *func_000016C4(void *ptr);
typedef struct {
    void *name;
    s32 index;
    u8 *buf;
    s32 size;
} Arc16_282;
extern Arc16_282 D_8022ABA8;
void func_0000A510(void *dst, void *src);
void boot_resource_archive_load_many(void *arc, void *reqs, s32 n);
void *func_002839E8(s32 id, s32 k) {
    void *out = resource_alloc_tree_scan(D_8009DAF4(id));
    s32 e;
    s32 size;
    u8 *raw;
    D_8009DBB8(out, id);
    e = ((s32 *)out)[k];
    size = D_8009DAF4(e);
    func_000016C4(out);
    raw = resource_alloc_tree_scan(size);
    D_8009DBB8(raw, e);
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        Arc16_282 arc = D_8022ABA8;
        Arc16_282 req = D_8022ABA8;
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
