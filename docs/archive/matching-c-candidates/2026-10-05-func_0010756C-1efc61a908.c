typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef struct RuntimeUnit RuntimeUnit;

#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))

extern s32 D_801F367C;
extern u8 D_8018F481;
extern s32 D_801F0DE0;
extern RuntimeUnit *D_801F0CB0[];

void func_0010756C(void)
{
    s32 count = D_801F367C;

    if (count > 0) {
        u32 field_value = D_8018F481;
        s32 total = count;
        s32 *state = &D_801F0DE0;
        s32 index = 0;

        do {
            RuntimeUnit *unit = D_801F0CB0[index];
            u32 flags = FIELD(unit, u32, 0x00);

            if (!(flags & 0x40)) {
                if (flags & 0x3002) {
                    flags |= 0x00040000;
                    FIELD(unit, u32, 0x00) = flags;
                    if (FIELD(unit, u8, 0x04) >= 0x1E) {
                        if (FIELD(unit, u32, 0x70) == 7)
                            FIELD(unit, u32, 0x00) = flags & ~0x00040000;
                    }
                } else {
                    FIELD(unit, u32, 0x00) = flags & ~0x00040000;
                }
            }
            if (field_value == 0x36) {
                if (FIELD(unit, u8, 0x04) == 0x1E) {
                    flags = FIELD(unit, u32, 0x00);
                    if (flags & 0x10)
                        FIELD(unit, u32, 0x00) = flags | 0x00040000;
                }
            }
            if (*state == 0x1B)
                FIELD(unit, u32, 0x00) &= ~0x00040000;
            if (*state == 0x1C)
                FIELD(unit, u32, 0x00) &= ~0x00040000;
            index++;
        } while (index < total);
    }
}
