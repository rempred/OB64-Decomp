typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;

typedef struct BodySource {
    u8 pad00[0x28];
    s16 x, y, z;
} BodySource;

typedef struct BodyUnit {
    BodySource *sources[3];
    u8 pad0C[0x3C];
    s32 classId;
    s32 variant;
} BodyUnit;

typedef struct BodyActor {
    u8 pad000[0xE4];
    s32 slot;
    u8 pad0E8[0x34];
    f32 x;
    u8 pad120[0x29];
    u8 sourceIndex;
} BodyActor;

extern s32 func_0020BFF8(BodyUnit *unit);
extern s32 func_0020C120(BodyUnit *unit);
extern f32 func_00201670(s32 classId, s32 variant);
extern f32 func_002016F4(s32 classId, s32 variant);
extern void func_002A0B14(s32 slot, f32 startX, f32 startZ, f32 targetX,
                         f32 targetZ, s32 duration, s32 scaledDuration);
extern s32 func_002A9364(s32 slot, s32 classId, s32 variant, s32 animation,
                        s32 arg5, s32 arg6, s32 arg7, s32 arg8);

s32 func_002AB0F8(BodyActor *actor, BodyUnit *unit)
{
    BodySource *source;
    s32 x, z;
    s16 animation;
    u8 isLeader;
    f32 scale, targetZ;
    s32 scaledDuration;
    s32 paired;

    isLeader = func_0020BFF8(unit) != 0;
    source = unit->sources[actor->sourceIndex];
    x = source->x;
    z = source->z;
    if (isLeader == 1) {
        animation = actor->x < (f32)x ? 5 : 11;
    } else {
        animation = (f32)x < actor->x ? 5 : 11;
    }

    if (animation == 5) {
        scale = func_00201670(unit->classId, unit->variant);
    } else {
        scale = func_002016F4(unit->classId, unit->variant);
    }
    targetZ = z;
    scaledDuration = (s32)(scale * 555.0f);
    func_002A0B14(actor->slot, -1.0f, -1.0f, x, targetZ, 0, scaledDuration);
    paired = func_0020C120(unit);
    if (paired == 1 && actor->sourceIndex == paired) {
        animation += 0x32;
    }
    func_002A9364(actor->slot, unit->classId, unit->variant, animation,
                  isLeader, isLeader, 0, 1);
    return 1;
}
