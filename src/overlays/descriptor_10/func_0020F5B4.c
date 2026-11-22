#include "game/boot_archive_record.h"

#include "game/resource_arena.h"

void *func_000016C4(void *p);
void *func_00001330(unsigned int size);
extern ResourceArchiveTemplate D_801D0640;
u32 D_8009DAF4(u32 id);
void *D_8009DBB8(void *dst, unsigned int id);
u32 func_0000ABE0(const u8 *p);
u32 func_0000A510(u8 *dst, const u8 *src);
void *func_0020F5B4(s32 id) {
    s32 size = D_8009DAF4(id);
    u8 *raw = resource_alloc_tree_scan(size);
    void *out;
    D_8009DBB8(raw, id);
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
