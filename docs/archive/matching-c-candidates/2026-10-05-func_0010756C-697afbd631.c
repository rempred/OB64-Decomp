typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
/* Minimum field view for the native producer; meanings remain unnamed. */
typedef struct RuntimeUnit {
    u32 field_00;
    u8 field_04;
    u8 field_05_to_6F[0x6B];
    u32 field_70;
} RuntimeUnit;

#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))

extern s32 D_801F367C;
extern u8 D_8018F481;
extern s32 D_801F0DE0;
extern RuntimeUnit *D_801F0CB0[];

void func_0010756C(void)
{
    s32 index;

    for (index = 0; index < D_801F367C; index++) {
        s32 *state = &D_801F0DE0;
        RuntimeUnit *unit = D_801F0CB0[index];
        u32 flags = unit->field_00;

        if (!(flags & 0x40)) {
            if (flags & 0x3002) {
                flags |= 0x00040000;
                unit->field_00 = flags;
                if (unit->field_04 >= 0x1E) {
                    if (unit->field_70 == 7)
                        unit->field_00 = flags & ~0x00040000;
                }
            } else {
                unit->field_00 = flags & ~0x00040000;
            }
        }
        if (D_8018F481 == 0x36) {
            if (unit->field_04 == 0x1E) {
                flags = unit->field_00;
                if (flags & 0x10)
                    unit->field_00 = flags | 0x00040000;
            }
        }
        if (*state == 0x1B)
            unit->field_00 &= ~0x00040000;
        if (*state == 0x1C)
            unit->field_00 &= ~0x00040000;
        }
}
