#include "game/class_field_lookups.h"

/* Return the name from the class selected by the character's two class IDs. */
const u8 *func_000440dc(s32 primary_class, s32 alternate_class)
{
    s8 *primary_record;
    int primary_offset;

    primary_offset = (primary_class & 0xFF) * 0x48;
    primary_record = (s8 *)(primary_offset + 0x80180000);
    alternate_class &= 0xFF;
    if (*(u8 *)(primary_record + 0x7C59) == alternate_class) {
        return *(const u8 * const *)(primary_record + 0x7C14);
    }

    return *(const u8 * const *)((alternate_class * 0x48) + 0x80187C14);
}
