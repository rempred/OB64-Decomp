#include "game/boot_archive_record.h"

void *func_00001330(unsigned int size);
void *func_00001330(unsigned int size);
void *func_000016C4(void *p);
extern ResourceArchiveTemplate D_801B99A0;
u32 D_8009DAF4(u32 id);
void *D_8009DBB8(void *dst, unsigned int id);
u32 func_0000ABE0(const u8 *p);
u32 func_0000A510(u8 *dst, const u8 *src);
void *func_001CEAD0(s32 id) {
    s32 size = D_8009DAF4(id);
    u8 *raw = func_00001330(size);
    void *out;
    D_8009DBB8(raw, id);
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        ResourceArchiveInput arc = D_801B99A0.input;
        ResourceArchiveRequest req = D_801B99A0.request;
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
