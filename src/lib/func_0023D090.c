#include "game/boot_archive_record.h"
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(const u8 *p);
void *func_00001330(unsigned int);
void *func_000016C4(void *ptr);

extern ResourceArchiveTemplate D_801F0490;
unsigned int func_0000A510(unsigned char *, const unsigned char *);

void D_801EFB24(u8 *data, s32 a, s32 b);
void *D_801EFC78(void);
void *func_0023D090(s32 id) {
    s32 size = D_8009DAF4(id);
    u8 *raw = func_00001330(size);
    void *out;
    D_8009DBB8(raw, id);
    if (raw[2] == '-' && raw[3] == 'l' && raw[4] == 'h') {
        ResourceArchiveInput arc = D_801F0490.input;
        ResourceArchiveRequest req = D_801F0490.request;
        arc.size = size;
        arc.buffer = raw;
        boot_resource_archive_load_many(&arc, &req, 1);
        func_000016C4(raw);
        out = req.buffer;
    } else if (raw[0] == 'H' && raw[1] == 'U') {
        D_801EFB24(raw, 1, 0);
        out = D_801EFC78();
    } else if (raw[0] == 'B' && raw[1] == '5') {
        D_801EFB24(raw, 1, 0);
        out = D_801EFC78();
    } else {
        out = func_00001330(func_0000ABE0(raw));
        func_0000A510(out, raw);
        func_000016C4(raw);
    }
    return out;
}
