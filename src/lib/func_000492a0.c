#include "game/resource_arena.h"

void *func_000016C4(void *p);
u32 D_8009DAF4(u32 id);
void *D_8009DBB8(void *dst, unsigned int id);
u32 func_0000ABE0(const u8 *p);
u32 func_0000A510(u8 *dst, const u8 *src);
s32 func_000492a0(s32 i) {
    s32 *buf;
    s32 *out;
    buf = resource_alloc_tree_scan(D_8009DAF4(0x19A8804));
    D_8009DBB8(buf, 0x19A8804);
    i *= 4;
    i += (s32)buf;
    i = *(s32 *)i;
    func_000016C4(buf);
    buf = resource_alloc_tree_scan(D_8009DAF4(i));
    D_8009DBB8(buf, i);
    i = (s32)func_0000ABE0((const u8 *)buf);
    out = resource_alloc_tree_scan(i);
    func_0000A510((u8 *)out, (const u8 *)buf);
    i = out[i / 4 - 1];
    func_000016C4(buf);
    func_000016C4(out);
    if ((i & 0xFF000000) == 0xFF000000) {
        return i & 0xFF;
    }
    return 0;
}
