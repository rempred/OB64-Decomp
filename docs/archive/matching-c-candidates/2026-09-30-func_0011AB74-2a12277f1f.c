typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
typedef struct RuntimeUnit RuntimeUnit;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))

extern void func_0011A9B8(f32 value, f32 *firstOut, f32 *secondOut, s32 count,
    void *first, void *second, void *third, void *fourth, void *fifth);

void func_0011AB74(f32 value, RuntimeUnit *unit, f32 *firstOut, f32 *secondOut)
{
    u8 *record = FIELD(unit, u8 *, 0xA4);
    func_0011A9B8(value, firstOut, secondOut, FIELD(record, s32, 0x08),
        FIELD(record, void *, 0x00),
        FIELD(FIELD(unit, u8 *, 0xA4), void *, 0x04),
        FIELD(FIELD(unit, u8 *, 0xA4), void *, 0x0C),
        FIELD(FIELD(unit, u8 *, 0xA4), void *, 0x10),
        FIELD(FIELD(unit, u8 *, 0xA4), void *, 0x14));
}
