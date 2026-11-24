#include "game/boot_archive_record.h"
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(const u8 *p);
void *func_00001330(unsigned int size);
void *func_000016C4(void *ptr);
extern ResourceArchiveTemplate D_801B99A0;
u32 func_0000A510(u8 *dst, const u8 *src);
extern inline void ArcInit1CE(ResourceArchiveTemplate *a) {
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
        ResourceArchiveTemplate arc;
        ResourceArchiveTemplate req;
        ArcInit1CE(&arc);
        ArcInit1CE(&req);
        arc.input.buffer = raw;
        arc.input.size = size;
        boot_resource_archive_load_many(&arc.input, &req.request, 1);
        out = req.request.buffer;
    } else {
        out = func_00001330(func_0000ABE0(raw));
        func_0000A510(out, raw);
    }
    func_000016C4(raw);
    return out;
}
