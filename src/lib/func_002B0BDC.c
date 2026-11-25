typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(u8 *p);
void * resource_alloc_tree_scan(u32);
void *func_000016C4(void *ptr);
typedef struct {
    void *name;
    s32 index;
    u8 *buf;
    s32 size;
} Arc2AE;
extern Arc2AE D_80243C78;
void func_0000A510(void *dst, void *src);
void boot_resource_archive_load_many(void *arc, void *reqs, s32 n);
void *func_002B0884(void *p);
void *func_002B0BDC(s32 id);
void *func_002B0BDC(s32 id) {
    s32 size = D_8009DAF4(id);
    u8 *raw;
    void *out;
    u8 *p;
    if (size != 0) {
        raw = resource_alloc_tree_scan(size);
        D_8009DBB8(raw, id);
        p = raw;
        if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
            Arc2AE arc = D_80243C78;
            Arc2AE req = D_80243C78;
            arc.buf = raw;
            arc.size = size;
            boot_resource_archive_load_many(&arc, &req, 1);
            out = req.buf;
        } else {
            if (*(u16 *)p == 0x4235) {
                u8 f = p[2];
                out = p;
                if (f & 4) {
                    goto done;
                }
                if (!(f & 2)) {
                    goto done;
                }
            }
            out = resource_alloc_tree_scan(func_0000ABE0(raw));
            func_0000A510(out, raw);
        }
        func_000016C4(raw);
    done:
        out = func_002B0884(out);
    } else {
        out = ((void *)0);
    }
    return out;
}
