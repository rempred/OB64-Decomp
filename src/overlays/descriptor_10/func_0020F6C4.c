#include "game/boot_archive_record.h"
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(const u8 *p);
void *func_00001330(unsigned int);
void *resource_alloc_tree_scan(u32 size);
void *func_000016C4(void *ptr);

extern ResourceArchiveTemplate D_801D0640;
unsigned int func_0000A510(unsigned char *, const unsigned char *);

void *func_0020F6C4(s32 id, s32 k) {
    s32 *index = resource_alloc_tree_scan(D_8009DAF4(id));
    s32 size;
    u8 *raw;
    void *out;
    raw = (u8 *)index;
    D_8009DBB8(raw, id);
    {
        s32 e = index[k];
        func_000016C4(raw);
        size = D_8009DAF4(e);
        raw = resource_alloc_tree_scan(size);
        D_8009DBB8(raw, e);
    }
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        ResourceArchiveInput arc = D_801D0640.input;
        ResourceArchiveRequest req = D_801D0640.request;
        arc.buffer = raw;
        arc.size = size;
        boot_resource_archive_load_many(&arc, &req, 1);
        out = req.buffer;
    } else {
        out = func_00001330(func_0000ABE0(raw));
        func_0000A510(out, raw);
    }
    func_000016C4(raw);
    return out;
}
