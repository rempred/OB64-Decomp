typedef unsigned char u8;
typedef unsigned int u32;
typedef int s32;

typedef struct RuntimeUnit {
    u32 flags;
    u8 field_04_to_A7[0xA4];
    s32 *field_A8;
} RuntimeUnit;

extern RuntimeUnit *D_801F0CB0[];

/* The list at +0xA8 ends at the literal -1. A matching index is accepted
 * only if the referenced runtime record has all three observed mask bits. */
s32 func_0012FB64(RuntimeUnit *unit, s32 index)
{
    s32 *list = unit->field_A8;
    if (list == 0) return 0;
    {
        s32 *cursor;
        for (cursor = list;; cursor++) {
            s32 value = *cursor;
            if (value == -1) return 0;
            if (value == index) break;
        }
        return (D_801F0CB0[index]->flags & 0x31) == 0x31;
    }
}
