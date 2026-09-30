typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit RuntimeUnit;

#define UNIT_FIELD(type, offset) (*(type *)((u8 *)unit + (offset)))
#define RECORD_FIELD(record, type, offset) (*(type *)((u8 *)(record) + (offset)))
extern RuntimeUnit *D_801F0CB0[];
extern f64 D_801EE098;
extern f32 func_8009CFE0(f32 first, f32 second);

void func_0010766C(RuntimeUnit *unit)
{
    s32 *list = UNIT_FIELD(s32 *, 0xA8);
    f32 minimum = 506.25f;
    s32 best = -1;
    RuntimeUnit *target;

    if (list != 0) {
        s32 index;

        for (index = 0; UNIT_FIELD(s32 *, 0xA8)[index] != -1; index++) {
            s32 id = UNIT_FIELD(s32 *, 0xA8)[index];
            target = D_801F0CB0[id];

            if ((RECORD_FIELD(target, u32, 0x00) & 0x11) == 0x11) {
                f32 dx = UNIT_FIELD(f32, 0x08) - RECORD_FIELD(target, f32, 0x08);
                f32 dz = UNIT_FIELD(f32, 0x10) - RECORD_FIELD(target, f32, 0x10);
                f32 distance = dx * dx + dz * dz;

                if (distance < minimum) {
                    minimum = distance;
                    best = id;
                }
            }
        }
        if (best != -1) {
            target = D_801F0CB0[best];
            {
            f32 first = UNIT_FIELD(f32, 0x10) - RECORD_FIELD(target, f32, 0x10);
            f32 second = RECORD_FIELD(target, f32, 0x08) - UNIT_FIELD(f32, 0x08);
            f32 angle = (f32)((f64)func_8009CFE0(first, second) / D_801EE098);

            while (angle < 0.0f)
                angle += 1.0f;
            while (angle >= 1.0f)
                angle -= 1.0f;
            if ((s32)((angle + 0.0625f) * 8.0f) !=
                (s32)((UNIT_FIELD(f32, 0x18) + 0.0625f) * 8.0f)) {
                UNIT_FIELD(f32, 0x1C) = angle;
                UNIT_FIELD(u32, 0x00) |= 2;
            }
            }
        }
    }
}
