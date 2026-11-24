#include "game/boot_archive_record.h"
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(const u8 *p);
void *func_00001330(unsigned int size);
void *func_000016C4(void *ptr);
extern ResourceArchiveTemplate D_801B99A0;
u32 func_0000A510(u8 *dst, const u8 *src);
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
        ResourceArchiveInput arc = D_801B99A0.input;
        ResourceArchiveRequest req = D_801B99A0.request;
        arc.buffer = raw;
        arc.size = size;
        boot_resource_archive_load_many(&arc, &req, 1);
        out = req.buffer;
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
