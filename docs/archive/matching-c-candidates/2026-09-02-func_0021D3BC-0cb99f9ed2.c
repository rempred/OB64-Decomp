typedef signed char s8;
typedef signed int s32;
typedef unsigned char u8;
typedef unsigned int u32;

void func_0021D3BC(u32 offset)
{
    s8 *context;
    s8 *final_context;
    s8 *initial_context;
    u32 adjustment;
    u32 cursor;
    u32 size;

    initial_context = *(s8 * volatile *)0x801CE8C0;
    size = ((u8 *)0x801E5C70)[*(u8 *)(initial_context + offset + 0x10)];
    context = *(s8 * volatile *)0x801CE8C0;
    cursor = offset;
    if (offset < *(u32 *)(context + 0x814) - size) {
        do {
            *(u8 *)(context + cursor + 0x10) = *(u8 *)(context + cursor + size + 0x10);
            context = *(s8 * volatile *)0x801CE8C0;
            cursor++;
        } while (cursor < *(u32 *)(context + 0x814) - size);
    }
    final_context = *(s8 * volatile *)0x801CE8C0;
    *(u32 *)(final_context + 0x814) -= size;
    *(u8 *)(final_context + offset + 0x11) += adjustment;
}
