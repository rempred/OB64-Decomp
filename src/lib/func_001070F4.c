typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef struct RuntimeUnit RuntimeUnit;

#define FIELD(object, type, recordIndex) (*(type *)((u8 *)(object) + (recordIndex)))
extern u8 D_800E7A90[];
extern u16 D_801F36D8[];

/* Preserve the original flat-index guards and neighbor priority. They do not
 * establish two-dimensional bounds or a larger map/row capacity. */
void func_001070F4(RuntimeUnit *unit)
{
    s32 recordIndex;
    u8 *map = *(u8 **)(D_800E7A90 + D_800E7A90[0x33] * 4);
    u16 *row = (u16 *)((u32)D_801F36D8 + (FIELD(unit, s32, 0x70) << 6));

    recordIndex = 3;
    do {
        RuntimeUnit *cursor = (RuntimeUnit *)((u8 *)unit + (recordIndex << 2));
        s32 index = FIELD(cursor, s32, 0x58);
        u8 *cell = map + index;
        if (row[*cell] == 0xFFFF) {
            if (index >= 0x41 && row[cell[-0x41]] != 0xFFFF)
                index -= 0x41;
            else if (index >= 0x40 && row[map[index - 0x40]] != 0xFFFF)
                index -= 0x40;
            else if (index >= 0x3F && row[map[index - 0x3F]] != 0xFFFF)
                index -= 0x3F;
            else if (index > 0 && row[map[index - 1]] != 0xFFFF)
                --index;
            else if (index < 0xFFF && row[map[index + 1]] != 0xFFFF)
                ++index;
            else if (index < 0xFC1 && row[map[index + 0x3F]] != 0xFFFF)
                index += 0x3F;
            else if (index < 0xFC0 && row[map[index + 0x40]] != 0xFFFF)
                index += 0x40;
            else if (index < 0xFBF && row[map[index + 0x41]] != 0xFFFF)
                index += 0x41;
            /* A separate indexed store lets GCC reduce every loop-derived
             * address and eliminate the counter in favor of the retail cursor. */
            FIELD(unit, s32, 0x58 + (recordIndex << 2)) = index;
        }
        ++recordIndex;
    } while (recordIndex < 4);
}
