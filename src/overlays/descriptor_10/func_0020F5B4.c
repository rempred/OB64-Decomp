typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *p);
void *func_00001330(unsigned int size);
typedef struct {
    void *name;
    s32 index;
    u8 *buf;
    s32 size;
} Arc16_20BCE0;
extern Arc16_20BCE0 D_801D0640;
s32 D_8009DAF4(s32 id);
void *D_8009DBB8(void *dst, unsigned int id);
u32 func_0000ABE0(const u8 *p);
u32 func_0000A510(u8 *dst, const u8 *src);
void boot_resource_archive_load_many(void *arc, void *reqs, s32 n);
void *resource_alloc_tree_scan(s32 size);
void *func_0020F5B4(s32 id) {
    s32 size = D_8009DAF4(id);
    u8 *raw = resource_alloc_tree_scan(size);
    void *out;
    D_8009DBB8(raw, id);
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        Arc16_20BCE0 arc = D_801D0640;
        Arc16_20BCE0 req = D_801D0640;
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
